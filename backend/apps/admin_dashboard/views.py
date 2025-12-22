from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from apps.collections.models import VintageItem
from apps.stories.models import Story
from apps.experiences.models import Experience
from apps.users.models import User


@staff_member_required
def dashboard(request):
    context = {
        "stats": {
            "items": VintageItem.objects.count(),
            "stories": Story.objects.count(),
            "experiences": Experience.objects.count(),
            "users": User.objects.count(),
        }
    }
    return render(request, "admin_dashboard/dashboard.html", context)
