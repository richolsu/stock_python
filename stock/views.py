import json
import time
from datetime import datetime

from django.contrib.auth.models import User
from django.core import serializers
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from stock.models import Ohlc, Strategy
from stock.serializers import OhlcSerializer, UserSerializer, ExchangeSymbolSerializer, StrategySerializer


# Create your views here.


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class OhlcViewSet(viewsets.ModelViewSet):
    queryset = Ohlc.objects.all()
    serializer_class = OhlcSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class StrategyPageListAPIView(APIView):
    serializer_class = OhlcSerializer
    authentication_classes = []

    @csrf_exempt
    def post(self, request, format=None):

        strategy = request.POST.get("strategy")
        exchange = request.POST.get("exchange")
        symbol = request.POST.get("symbol")
        granularity_in_ms = request.POST.get("granularityInMs")
        threshold = request.POST.get("threshold")
        start_date = request.POST.get("start_date")
        end_date = request.POST.get("end_date")
        order = request.POST.get("order", "name")
        order_dir = request.POST.get("dir", "asc")
        importance = float(threshold) / 100
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')

        params = {
            "strategy": str(strategy),
            "exchange": str(exchange),
            "symbol": str(symbol),
            "granularityInMs": granularity_in_ms,
            "importance": importance,
            "start": time.mktime(start.timetuple()) * 1000,
            "end": time.mktime(end.timetuple()) * 1000,
            "order": str(order),
            "dir": str(order_dir),
        }

        query = "SELECT 1 id, a.high, a.low, a.volume, a.startMs, a.count, round(b.importance * 100, 2) importance, a.open, " \
                "a.close FROM OHLC a left join strategy b  on a.exchange = b.exchange and a.symbol = b.symbol " \
                "and a.granularityInMs = b.granularityInMs and a.startMs = b.startMs and b.strategyName = %(strategy)s " \
                "where b.exchange = %(exchange)s and b.symbol = %(symbol)s and b.granularityInMs = %(granularityInMs)s " \
                "and b.importance> %(importance)s and b.startMs>= %(start)s and b.startMs < %(end)s order by %(order)s %(dir)s"

        serializer = OhlcSerializer(Ohlc.objects.raw(query, params), many=True)
        return JsonResponse(serializer.data, safe=False, status=201)



def index(request):
    select_list_queryset = Ohlc.objects.raw('SELECT DISTINCT 1 id, exchange, symbol, granularityInMs  FROM OHLC')
    strategy_list_queryset = Ohlc.objects.raw('SELECT DISTINCT 1 id, strategyName FROM strategy')

    select_items = []
    for p in select_list_queryset:
        select_items.append({'exchange': p.exchange, 'symbol': p.symbol, 'granularityInMs': p.granularityInMs})

    strategy_items = []
    for p in strategy_list_queryset:
        strategy_items.append(p.strategyName)

    context = {
        'select_list': json.dumps(select_items),
        'strategy_list': json.dumps(strategy_items),
    }
    return render(request, 'stock/index.html', context)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'ohlc': reverse('ohlc-list', request=request, format=format)
    })


@csrf_exempt
def history_data(request):
    exchange = request.POST.get("exchange", "gdax")
    symbol = request.POST.get("symbol", "BTC-USD")
    granularity_in_ms = request.POST.get("granularityInMs", "")
    start_date = request.POST.get("start_date", "")
    end_date = request.POST.get("end_date", "")

    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    granularity_in_ms = int(granularity_in_ms) * 60000
    data = Ohlc.objects.filter(exchange=exchange).filter(symbol=symbol).filter(granularityInMs=granularity_in_ms)\
        .filter(startMs__gte=time.mktime(start.timetuple())*1000).filter(startMs__lt=time.mktime(end.timetuple())*1000)

    serializer_context = {
        'request': Request(request),
    }

    serializer = OhlcSerializer(data, context=serializer_context, many=True)
    return JsonResponse(serializer.data, safe=False, status=201)


@csrf_exempt
def detail_data(request):
    exchange = request.POST.get("exchange", "gdax")
    symbol = request.POST.get("symbol", "BTC-USD")
    granularity_in_ms = request.POST.get("granularityInMs", "")
    start = request.POST.get("start_date", "")
    end = request.POST.get("end_date", "")

    granularity_in_ms = int(granularity_in_ms)
    data = Ohlc.objects.filter(exchange=exchange).filter(symbol=symbol).filter(granularityInMs=granularity_in_ms) \
        .filter(startMs__gte=start).filter(startMs__lt=end)

    serializer_context = {
        'request': Request(request),
    }

    serializer = OhlcSerializer(data, context=serializer_context, many=True)
    return JsonResponse(serializer.data, safe=False, status=201)


@csrf_exempt
def run_strategy(request):
    strategy = request.POST.get("strategy")
    exchange = request.POST.get("exchange")
    symbol = request.POST.get("symbol")
    granularity_in_ms = request.POST.get("granularityInMs")
    threshold = request.POST.get("threshold")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")

    importance = float(threshold) / 100
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')

    params = {
        "strategy": str(strategy),
        "exchange": str(exchange),
        "symbol": str(symbol),
        "granularityInMs": granularity_in_ms,
        "importance": importance,
        "start": time.mktime(start.timetuple()) * 1000,
        "end": time.mktime(end.timetuple()) * 1000,
    }

    query = "SELECT count(*) total,round(100*avg(importance),2) percent, avg(volume) volume FROM strategy " \
            "WHERE strategyName=%(strategy)s and exchange = %(exchange)s and symbol = %(symbol)s " \
            "and granularityInMs = %(granularityInMs)s and importance> %(importance)s " \
            "and startMs>= %(start)s and startMs < %(end)s"

    cursor = connection.cursor()
    cursor.execute(query, params)
    row = cursor.fetchone()

    columns = [col[0] for col in cursor.description]
    data = dict(zip(columns, row))
    return JsonResponse(data, safe=False)


@csrf_exempt
def strategy_all(request):
    strategy = request.POST.get("strategy")
    exchange = request.POST.get("exchange")
    symbol = request.POST.get("symbol")
    granularity_in_ms = request.POST.get("granularityInMs")
    threshold = request.POST.get("threshold")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    importance = float(threshold) / 100

    granularity_in_ms = int(granularity_in_ms)
    data = Strategy.objects.filter(strategyName=strategy).filter(exchange=exchange).filter(symbol=symbol)\
        .filter(granularityInMs=granularity_in_ms).filter(importance__gt=importance)\
        .filter(startMs__gte=time.mktime(start.timetuple())*1000).filter(startMs__lt=time.mktime(end.timetuple())*1000)

    serializer_context = {
        'request': Request(request),
    }

    serializer = StrategySerializer(data, context=serializer_context, many=True)
    return JsonResponse(serializer.data, safe=False, status=201)


@csrf_exempt
def strategy_page_result(request):

    strategy = request.POST.get("strategy")
    exchange = request.POST.get("exchange")
    symbol = request.POST.get("symbol")
    granularity_in_ms = request.POST.get("granularityInMs")
    threshold = request.POST.get("threshold")
    start_date = request.POST.get("start_date")
    end_date = request.POST.get("end_date")
    order = request.POST.get("order", "name")
    order_dir = request.POST.get("dir", "asc")
    importance = float(threshold) / 100
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')

    params = {
        "strategy": str(strategy),
        "exchange": str(exchange),
        "symbol": str(symbol),
        "granularityInMs": granularity_in_ms,
        "importance": importance,
        "start": time.mktime(start.timetuple()) * 1000,
        "end": time.mktime(end.timetuple()) * 1000,
        "order": str(order),
        "dir": str(order_dir),
    }

    query = "SELECT a.high, a.low, a.volume, a.startMs, a.count, round(b.importance * 100, 2) importance, a.open, " \
            "a.close FROM OHLC a left join strategy b  on a.exchange = b.exchange and a.symbol = b.symbol " \
            "and a.granularityInMs = b.granularityInMs and a.startMs = b.startMs and b.strategyName = %(strategy)s " \
            "where b.exchange = %(exchange)s and b.symbol = %(symbol)s and b.granularityInMs = %(granularityInMs)s " \
            "and b.importance> %(importance)s and b.startMs>= %(start)s and b.startMs < %(end)s order by %(order)s %(dir)s"

    cursor = connection.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()

    columns = [col[0] for col in cursor.description]
    data = rows = [dict(zip(columns, row)) for row in rows]
    return JsonResponse(data, safe=False)


