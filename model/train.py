#%%
import fasttext
# import tensorflow as tf
import pycantonese as pc
# from pycantonese.word_segmentation import Segmenter

#%%

model = fasttext.train_supervised(input="newdata.train", epoch=50, lr=1.0, wordNgrams=1, loss='hs', thread=6)
model.save_model('model_newdata.bin')

#%%
model = fasttext.load_model('model_newdata.bin')
# line = " ".join(pc.segment("其實陣容同上季比分別唔大但係點解從護班球隊 變做爭標份子 ？？？？主要三大引援第一 門將 馬天尼斯馬天尼斯極為穩定 幫維拉左飛右撲 防線絕對領軍人物第二 前鋒 屈堅斯各方面都非常平均 穩定入球效率 前面hold到波之前果個wesley其實都ok 不過傷多過踢屈堅斯對維拉鋒線黎講簡直救世主第三 右閘 Cash呢個唔使講 大家有做過人 都知現金幾重要至於里昂果個traore 我覺得麻麻 好多波處理上面都好無腦"))
# print(model.predict(line, k=5))
print(model.test("nexdata.valid", k=1))
# %%
# model1 = fasttext.load_model('../wiki.zh_yue.bin')
# model1.get_word_vector('粉紅')

# %%

# Customize network

# pycantonese to cut sentence into words
# fasttext to transfer words to vector arrays