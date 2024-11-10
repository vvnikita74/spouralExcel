from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Sheet


class ProcessInputView(APIView):
    def post(self, request):
        data = request.data

        print(data.get('customer'))
        print(data.get('objectType'))

        count = 0

        for list in  Sheet.objects.all():
            count += 1
            # wb open sheet with list.index
            # list.template processing
            # list.countCell processing

        # удалился последний лист
        # wb = ...
        # wb.save(f'{date.now()}-{userName}.xlsx')
        # script execute. to pdf
        #{date.now()}-{userName}.pdf
        #...

        if not data:
            return Response({'error': 'No input data provided'},
                            status=status.HTTP_400_BAD_REQUEST)
        # обработка данных и вставка в Excel
        return Response({'message': 'Success'},
                        status=status.HTTP_200_OK)
