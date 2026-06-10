#!/bin/bash
# Отключаем аппаратный OpenGL, включаем программную эмуляцию
export LIBGL_ALWAYS_SOFTWARE=1
export GALLIUM_DRIVER=llvmpipe

# Запуск сервера без графики (самый надежный способ)
java -Xmx1G -jar server.jar nogui
