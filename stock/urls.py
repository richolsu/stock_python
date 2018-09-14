"""stockweb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.urls import path, include

from stock.views import UserViewSet, OhlcViewSet
from . import views

user_list = UserViewSet.as_view({
    'get': 'list'
})
user_detail = UserViewSet.as_view({
    'get': 'retrieve'
})

ohlc_list = OhlcViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

ohlc_detail = OhlcViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^api/$', views.api_root),
    url(r'^users/$', user_list, name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name='user-detail'),
    url(r'^ohlc/$', ohlc_list, name='ohlc-list'),
    url(r'^ohlc/(?P<pk>[0-9]+)/$', ohlc_detail, name='ohlc-detail'),
    path('history_data', views.history_data, name='history_data'),
    path('detail_data', views.detail_data, name='detail_data'),
    path('run_strategy', views.run_strategy, name='run_strategy'),
    path('strategy_all', views.strategy_all, name='strategy_all'),
    path('strategy_page_result', views.strategy_page_result, name='strategy_page_result'),
    url(r'^api-auth/', include('rest_framework.urls'))
]
