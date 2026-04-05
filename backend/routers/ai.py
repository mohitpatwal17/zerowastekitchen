from fastapi import APIRouter, Depends, HTTPException
import schemas
from ai_engine.ai_client import ai_client

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

@router.post("/proxy", response_model=schemas.AIProxyResponse)
async def ai_proxy(request: schemas.AIProxyRequest):
    """
    Proxies AI requests to NVIDIA/OpenAI to avoid CORS and hide API keys.
    """
    # Use the shared ai_client
    response_text = ai_client.generate_content(
        prompt=request.prompt, 
        system_instruction=request.system_instruction
    )
    
    if not response_text:
        raise HTTPException(status_code=500, detail="AI Engine failed to generate response")
        
    return schemas.AIProxyResponse(response=response_text)
