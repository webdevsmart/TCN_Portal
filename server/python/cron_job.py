from crontab import CronTab
cron = CronTab(user='root')
print("123123", CronTab)
job = cron.new(command='echo hello_wo')
job.minute.every(1)
cron.write()