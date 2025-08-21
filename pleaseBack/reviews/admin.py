from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'created_at', 'approved']
    list_filter = ['rating', 'approved', 'created_at']
    search_fields = ['name', 'review']