"""
Configuration module for the life automation backend.
Handles environment-specific settings and URL configurations.
"""
import os


def get_base_url():
    """
    Automatically determine the base URL based on the environment.
    Returns localhost URL for local development, Cloud Run URL for cloud deployment.
    
    Returns:
        str: The appropriate base URL for the current environment
    """
    # Check if running in Google Cloud Run
    if os.getenv('K_SERVICE') or os.getenv('GOOGLE_CLOUD_PROJECT'):
        return 'https://life-automation-api-1050310982145.europe-west2.run.app'
    
    # Check if running in other cloud environments
    if os.getenv('PORT') and not os.getenv('LOCALDEV'):
        return 'https://life-automation-api-1050310982145.europe-west2.run.app'
    
    # Default to localhost for local development
    return "http://localhost:8000"


def is_local_environment():
    """
    Check if the application is running in a local development environment.
    
    Returns:
        bool: True if running locally, False if running in cloud
    """
    return not (os.getenv('K_SERVICE') or os.getenv('GOOGLE_CLOUD_PROJECT') or 
                (os.getenv('PORT') and not os.getenv('LOCALDEV')))


def get_environment_name():
    """
    Get a human-readable name for the current environment.
    
    Returns:
        str: Environment name ('local', 'cloud-run', or 'cloud')
    """
    if os.getenv('K_SERVICE'):
        return 'cloud-run'
    elif os.getenv('GOOGLE_CLOUD_PROJECT'):
        return 'gcp'
    elif os.getenv('PORT') and not os.getenv('LOCALDEV'):
        return 'cloud'
    else:
        return 'local'


# Configuration constants
class Config:
    """Configuration class with environment-specific settings."""
    
    BASE_URL = get_base_url()
    ENVIRONMENT = get_environment_name()
    IS_LOCAL = is_local_environment()
    
    # Cloud Run specific settings
    CLOUD_RUN_URL = 'https://life-automation-api-1050310982145.europe-west2.run.app'
    LOCAL_URL = "http://localhost:8000"
    
    # You can add other configuration settings here
    # DATABASE_URL = os.getenv('DATABASE_URL', 'default_local_db_url')
    # DEBUG = IS_LOCAL
