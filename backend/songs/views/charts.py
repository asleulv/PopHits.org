from rest_framework import generics
from rest_framework.response import Response

from ..models import CurrentHot100
from ..serializers import CurrentHot100Serializer


class CurrentHot100View(generics.ListAPIView):
    serializer_class = CurrentHot100Serializer

    def get_queryset(self):
        return CurrentHot100.objects.all().order_by('current_position')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        latest_chart = queryset.first()
        chart_date = latest_chart.chart_date if latest_chart else None

        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'chart_date': chart_date,
            'songs': serializer.data
        })
