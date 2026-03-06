from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "A database error occurred. Please try again."},
        )
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        return JSONResponse(
            status_code=422,
            content={"detail": str(e)},
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred."},
        )
