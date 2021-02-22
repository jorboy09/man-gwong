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
print(model.test("nexdata.valid", k=1))