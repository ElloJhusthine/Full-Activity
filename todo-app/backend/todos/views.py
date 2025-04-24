from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
import logging

logger = logging.getLogger(__name__)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        try:
            tasks = Task.objects.all()
            logger.info(f"Fetched {tasks.count()} tasks.")
            return tasks
        except Exception as e:
            logger.error(f"Error in get_queryset: {e}")
            raise
