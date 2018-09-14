from django.db import models

# Create your models here.


class Ohlc(models.Model):

    granularityInMs = models.IntegerField()
    exchange = models.CharField(max_length=32)
    symbol = models.CharField(max_length=16)
    startMs = models.BigIntegerField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    volume = models.FloatField()
    count = models.IntegerField()

    class Meta:
        db_table = "ohlc_id"
        unique_together = (("granularityInMs", "exchange", "symbol", "startMs"),)


class Strategy(models.Model):

    strategyName = models.CharField(max_length=32)
    granularityInMs = models.IntegerField()
    exchange = models.CharField(max_length=32)
    symbol = models.CharField(max_length=16)
    startMs = models.BigIntegerField()
    volume = models.FloatField()
    count = models.IntegerField()
    importance = models.FloatField()

    class Meta:
        db_table = "strategy_id"
        unique_together = (("strategyName", "granularityInMs", "exchange", "symbol", "startMs"),)

