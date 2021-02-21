# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import fasttext
import sys
import json
import base64

model = fasttext.load_model('model_newdata.bin') 

class MainHandler(tornado.web.RequestHandler):
    def post(self):
        content = json.loads(self.request.body.decode('utf-8'))
        # print(content)
        _result_ = model.predict(content['content'], k=3)
        _listResult_ = ''
        for result in _result_[0]:
            _listResult_+= base64.b64encode(result.encode('utf-8')).decode('utf-8') + ','
        print(_listResult_)
        _json_result_ = json.dumps({'result': _listResult_})
        self.write(_json_result_)

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()