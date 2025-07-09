from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import networkx as nx
import json
import re
import requests


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

class ExecutionRequest(BaseModel):
    pipeline: Pipeline
    inputs: Dict[str, Any] = {}

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline) -> PipelineResponse:
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    
    G = nx.DiGraph()
    for node in pipeline.nodes:
        G.add_node(node.id)
    for edge in pipeline.edges:
        G.add_edge(edge.source, edge.target)
    
    is_dag = nx.is_directed_acyclic_graph(G)
    
    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag
    )

# Node execution functions
def execute_input_node(node: Node, inputs: Dict[str, Any]):
    """Execute input node - get data from user inputs"""
    input_name = node.data.get('inputName', node.id)
    input_type = node.data.get('inputType', 'Text')
    
    # Get value from provided inputs or use default
    value = inputs.get(input_name, f"Sample {input_type} for {input_name}")
    
    return {'output': value}

def execute_output_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute output node - pass through the input"""
    input_value = list(node_inputs.values())[0] if node_inputs else ''
    output_name = node.data.get('outputName', 'output')
    
    return {
        'output': input_value,
        'name': output_name
    }

def execute_llm_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute LLM node - simulate LLM response"""
    system_prompt = node_inputs.get(f"{node.id}-system", "You are a helpful assistant.")
    user_prompt = node_inputs.get(f"{node.id}-prompt", "Hello")
    
    # Simulate LLM response (in real implementation, call actual LLM API)
    simulated_response = f"Response to '{user_prompt}' with system: '{system_prompt}'"
    
    # For demo, we could integrate with OpenAI API here:
    # response = openai.ChatCompletion.create(...)
    
    return {'output': simulated_response}

def execute_text_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute text node - replace variables with inputs"""
    text_template = node.data.get('text', '')
    
    # Debug logging
    print(f"Text node {node.id} - Template: {text_template}")
    print(f"Text node {node.id} - Inputs: {node_inputs}")
    
    def replace_var(match):
        var_name = match.group(1)
        handle_id = f"{node.id}-{var_name}"
        value = node_inputs.get(handle_id, f"{{{{{var_name}}}}}")
        print(f"Replacing {{{{{var_name}}}}} with {value}")
        return str(value)
    
    output = re.sub(r'\{\{(\w+)\}\}', replace_var, text_template)
    print(f"Text node {node.id} - Output: {output}")
    return {'output': output}

def execute_api_call_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute API call node"""
    endpoint = node.data.get('endpoint', '')
    method = node.data.get('method', 'GET')
    body = node_inputs.get(f"{node.id}-body", {})
    
    try:
        if method == 'GET':
            response = requests.get(endpoint, timeout=10)
        elif method == 'POST':
            response = requests.post(endpoint, json=body, timeout=10)
        elif method == 'PUT':
            response = requests.put(endpoint, json=body, timeout=10)
        elif method == 'DELETE':
            response = requests.delete(endpoint, timeout=10)
        else:
            return {'output': f"Unsupported HTTP method: {method}"}
        
        return {'output': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text}
    except Exception as e:
        return {'output': f"API Error: {str(e)}"}

def execute_data_transform_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute data transformation node"""
    operation = node.data.get('operation', 'uppercase')
    input_data = list(node_inputs.values())[0] if node_inputs else ''
    
    try:
        if operation == 'uppercase':
            output = input_data.upper() if isinstance(input_data, str) else str(input_data).upper()
        elif operation == 'lowercase':
            output = input_data.lower() if isinstance(input_data, str) else str(input_data).lower()
        elif operation == 'parse_json':
            output = json.loads(input_data) if isinstance(input_data, str) else input_data
        elif operation == 'stringify':
            output = json.dumps(input_data) if not isinstance(input_data, str) else input_data
        else:
            output = input_data
    except Exception as e:
        output = f"Transform Error: {str(e)}"
    
    return {'output': output}

def execute_conditional_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute conditional node"""
    condition = node.data.get('condition', 'equals')
    compare_value = node.data.get('value', '')
    input_value = list(node_inputs.values())[0] if node_inputs else ''
    
    try:
        # Convert to appropriate types for comparison
        if isinstance(compare_value, str) and compare_value.isdigit() and str(input_value).isdigit():
            input_value = int(input_value)
            compare_value = int(compare_value)
        
        if condition == 'equals':
            result = input_value == compare_value
        elif condition == 'not_equals':
            result = input_value != compare_value
        elif condition == 'greater_than':
            result = float(input_value) > float(compare_value)
        elif condition == 'less_than':
            result = float(input_value) < float(compare_value)
        else:
            result = False
    except (ValueError, TypeError):
        result = False
    
    return {
        'true_output': input_value if result else None,
        'false_output': input_value if not result else None,
        'result': result
    }

def execute_loop_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute loop node"""
    try:
        iterations = int(node.data.get('iterations', 10))
    except (ValueError, TypeError):
        iterations = 10
    
    input_value = list(node_inputs.values())[0] if node_inputs else ''
    
    # For demo, collect results of iterations
    loop_results = []
    for i in range(iterations):
        loop_results.append(f"{input_value} - iteration {i+1}")
    
    return {
        'loop_output': loop_results,
        'complete_output': f"Completed {iterations} iterations",
        'iterations': iterations
    }

def execute_database_node(node: Node, node_inputs: Dict[str, Any]):
    """Execute database query node"""
    db_type = node.data.get('database', 'sqlite')
    query = node.data.get('query', 'SELECT 1')
    params = node_inputs.get(f"{node.id}-params", {})
    
    # For demo, return simulated results
    # In production, we would connect to actual databases
    simulated_results = [
        {"id": 1, "name": "Sample Row 1", "value": 100},
        {"id": 2, "name": "Sample Row 2", "value": 200}
    ]
    
    return {'output': simulated_results}

@app.post('/pipelines/execute')
def execute_pipeline(request: ExecutionRequest):
    """Execute the pipeline with provided inputs"""
    pipeline = request.pipeline
    user_inputs = request.inputs
    
    # Create directed graph
    G = nx.DiGraph()
    node_map = {node.id: node for node in pipeline.nodes}
    
    # Add all nodes first
    for node in pipeline.nodes:
        G.add_node(node.id)
    
    # Build graph with edges
    for edge in pipeline.edges:
        G.add_edge(edge.source, edge.target, 
                   sourceHandle=edge.sourceHandle, 
                   targetHandle=edge.targetHandle)
    
    # Check if it's a DAG
    if not nx.is_directed_acyclic_graph(G):
        raise HTTPException(status_code=400, detail="Pipeline must be a DAG")
    
    # Execute nodes in topological order
    execution_order = list(nx.topological_sort(G))
    node_outputs = {}
    execution_log = []
    
    for node_id in execution_order:
        node = node_map[node_id]
        node_inputs = {}
        
        # Gather inputs from predecessor nodes
        for pred in G.predecessors(node_id):
            edge_data = G.get_edge_data(pred, node_id)
            source_handle = edge_data.get('sourceHandle', f"{pred}-output")
            target_handle = edge_data.get('targetHandle', f"{node_id}-input")
            
            pred_output = node_outputs.get(pred, {})
            
            # Handle different output types
            if node_map[pred].type == 'conditional':
                if 'true' in source_handle:
                    value = pred_output.get('true_output')
                elif 'false' in source_handle:
                    value = pred_output.get('false_output')
                else:
                    value = pred_output.get('output')
            elif node_map[pred].type == 'loop':
                if 'loop' in source_handle:
                    value = pred_output.get('loop_output')
                elif 'complete' in source_handle:
                    value = pred_output.get('complete_output')
                else:
                    value = pred_output.get('output')
            else:
                value = pred_output.get('output')
            
            if value is not None:
                node_inputs[target_handle] = value
        
        # Execute node based on type
        try:
            if node.type == 'customInput':
                result = execute_input_node(node, user_inputs)
            elif node.type == 'customOutput':
                result = execute_output_node(node, node_inputs)
            elif node.type == 'llm':
                result = execute_llm_node(node, node_inputs)
            elif node.type == 'text':
                result = execute_text_node(node, node_inputs)
            elif node.type == 'apiCall':
                result = execute_api_call_node(node, node_inputs)
            elif node.type == 'dataTransform':
                result = execute_data_transform_node(node, node_inputs)
            elif node.type == 'conditional':
                result = execute_conditional_node(node, node_inputs)
            elif node.type == 'loop':
                result = execute_loop_node(node, node_inputs)
            elif node.type == 'database':
                result = execute_database_node(node, node_inputs)
            else:
                result = {'output': f"Unknown node type: {node.type}"}
            
            node_outputs[node_id] = result
            execution_log.append({
                'node_id': node_id,
                'node_type': node.type,
                'status': 'success',
                'output': result
            })
        except Exception as e:
            execution_log.append({
                'node_id': node_id,
                'node_type': node.type,
                'status': 'error',
                'error': str(e)
            })
    
    # Collect final outputs
    final_outputs = {}
    for node_id, output in node_outputs.items():
        node = node_map[node_id]
        if node.type == 'customOutput':
            output_name = output.get('name', node_id)
            final_outputs[output_name] = output.get('output')
    
    return {
        'success': True,
        'outputs': final_outputs,
        'execution_log': execution_log,
        'node_outputs': node_outputs
    }