from django import template

register = template.Library()

@register.filter
def fix_quote(value):
    return value.replace("'", "&#39;")