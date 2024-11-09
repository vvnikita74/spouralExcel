from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class ProcessInputView(APIView):
    def post(self, request):
        data = request.data.get('input_data', [])

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
        return Response({'message': 'Data processed and inserted into Excel'},
                        status=status.HTTP_200_OK)
