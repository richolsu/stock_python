from django.contrib.auth.models import User
from django.test import TestCase

# Create your tests here.
from rest_framework import serializers

from stock.models import Ohlc, Strategy


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff')


class OhlcSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField('get_start_ms')

    class Meta:
        model = Ohlc
        fields = ('url', 'id', 'granularityInMs', 'exchange', 'symbol', 'date', 'startMs', 'open', 'high', 'low', 'close', 'volume', 'count')

    def get_start_ms(self, obj):
        return obj.startMs

class ExchangeSymbolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ohlc
        fields = ('exchange', 'symbol', 'granularityInMs')


class StrategyNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = 'strategyName'


class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = ('startMs',)
