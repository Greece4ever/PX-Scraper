from rest_framework.throttling import ScopedRateThrottle

class APIDEMOThrottle(ScopedRateThrottle):
    scope_attr = 'service_test'

class LOGINThrottle(ScopedRateThrottle):
    scope_attr = 'login'

class APIThrottle(ScopedRateThrottle):
    scope_attr = 'api_direct'

class UIURLThrottle(ScopedRateThrottle):
    scope_attr = 'ui_direct'