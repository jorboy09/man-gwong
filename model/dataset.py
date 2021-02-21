import random
import pycantonese as pc
lines = open('newdata.txt', encoding='utf-8').readlines()
random.shuffle(lines)
for line in lines:
    li = pc.segment(line)
    li = " ".join(li)
    li = li.replace('_ _ label _ _ ', '__label__')
    li = li.lower()
    open('newdata.processed.txt', 'a' , encoding='utf-8').writelines(li)

# with open('newdata.txt', encoding='utf-8') as newdata:
#     lines = newdata.readlines()
#     random.shuffle(lines)
#     for line in lines:
#         li = pc.segment(line)
#         li = " ".join(li)
#         li = li.replace('_ _ label _ _ ', '__label__')
#         li = li.lower()
#         open('newdata.processed.txt', 'a' , encoding='utf-8').writelines(li)