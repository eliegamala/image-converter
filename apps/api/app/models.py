from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class RecommendFormatResponse(BaseModel):
    recommended_format: str
