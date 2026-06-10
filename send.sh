#!/bin/bash
git add .
git commit -m "Update project: $(date +'%d.%m.%Y %H:%M:%S')"
git push
echo "Готово! Изменения отправлены на сервер."
