from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import JsonResponse
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Email, User

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request, 'mailview/index.html')
    else:
        return HttpResponseRedirect(reverse('user:login'))

@login_required
@csrf_exempt
def compose(request):
    if request.method!="POST":
        return JsonResponse({'message': 'Require post request!'}, status=400)
    data= json.loads(request.body)
    recipients= data.get('recipients','')
    emails= [email.strip() for email in recipients.split(',')]
    if emails==[]:
        return JsonResponse({'message' : 'At least one recipients'}, status=400)
    recipients= []
    for email in emails:
        try:
            user= User.objects.get(email=email)
            recipients.append(user)
        except User.DoesNotExist:
            return JsonResponse({'message' : 'Recipients does not exist!'}, status=400)
    subject= data.get('subject','')
    body= data.get('body','')

    users= set()
    users.add(request.user)
    users.update(recipients)
    for user in users:
        email= Email(
            user= user,
            sender= request.user,
            subject= subject,
            body= body,
            read= request.user == user
        )
        email.save()
        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()
    return JsonResponse({'message' : 'Successful to Post'}, status=201)

def mailbox(request,mail_box):
    if mail_box=='inbox':
        emails= Email.objects.filter(
            user= request.user, 
            recipients= request.user,
            archived= False
        )
    elif mail_box=='sent':
        emails= Email.objects.filter(
            user= request.user,
            sender= request.user
        )
    elif mail_box=='archived':
        emails= Email.objects.filter(
            user= request.user,
            recipients= request.user,
            archived= True
        )
    else:
        return JsonResponse({'message' : 'Invalid Get Request'}, status=400)
    
    emails= emails.order_by('-timestamp').all()
    return JsonResponse([email.serialize() for email in emails], safe=False)

def mail_detail(request, mail_id):
    try:
        email= Email.objects.get(id=mail_id, user= request.user)
    except Email.DoesNotExist:
        return JsonResponse({'message' : 'Id not exists!'}, status=400)
    return JsonResponse(email.serialize(), status=200)