import inspect


def patched_getargspec(func):
    fullargspec = inspect.getfullargspec(func)
    return fullargspec.args, fullargspec.varargs, fullargspec.varkw, fullargspec.defaults


def apply_patch():
    """
    Исправление ошибки Python 3.13
    """
    inspect.getargspec = patched_getargspec
