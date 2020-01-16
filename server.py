#!/usr/bin/env python2
# -*- coding: utf-8 -*-

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import json
import os


class S(BaseHTTPRequestHandler):

    def log_request(self, code): 
        pass

    def do_GET(self):
        self.path = self.path.split('?')[0]
        if self.path == '/': self.path = '/editor/'
        if self.path.endswith('/') or self.path == '':
            self.path += 'index.html'

        ext_map={
            'manifest': 'text/cache-manifest',
            'html': 'text/html',
            'png': 'image/png',
            'jpg': 'image/jpg',
            'svg': 'image/svg+xml',
            'css': 'text/css',
            'js':  'application/x-javascript',
            'json': 'application/json',
            'xml': 'application/xml',
            '': 'application/octet-stream', # Default
        }
        ext = self.path.split('.')[1]
        try:
            content_type = ext_map[ext]
        except KeyError:
            content_type = ext_map['']

        try:
            with open('.' + self.path, "r") as f:
                page = f.read()
                self.send_response(200)

        except IOError:
            self.send_response(404)
            page = ""; 
        self.send_header('Content-type', content_type)

        self.end_headers()

        self.wfile.write(page)


    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        if self.path == '/auto_assets':

            self.update_assets()
            self.send_response(200)
            self.send_header('Content-type', "text/plain")
            self.end_headers()
            self.wfile.write("game/assets/json/assets.json sucessfully updated")


        if self.path == '/set_json':


            data = json.loads(self.data_string)

            with open(data["path"], "w") as outfile:
                json.dump(data["data"], outfile, indent=2)
                
            self.update_assets()
            self.send_response(200)
            self.send_header('Content-type', "text/plain")
            self.end_headers()
            self.wfile.write("%s sucessfully updated (+ auto_assets)" % data["path"])
            print "Mise a jour / creation de %s" % data["path"]


        return

    def update_assets(self):


        assets = {
            'json':[],
            'png':[]
        }
        for directory, _, files in os.walk('game/assets/json'):
            for fi in files:
                if(fi.endswith('.json')):
                    p = directory+'/'+fi.split('.')[0]
                    assets['json'].append(p[len('game/assets/json/'):])

        for directory, _, files in os.walk('game/assets/img'):
            for fi in files:
                if(fi.endswith('.png')):
                    p = directory+'/'+fi.split('.')[0]
                    assets['png'].append(p[len('game/assets/img/'):])

        with open('game/assets/json/assets.json', "w") as outfile:
            json.dump(assets, outfile, indent=2)
        
        print "Mise a jour des assets (game/assets/json/assets.json)"


def run(server_class=HTTPServer, handler_class=S, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Le server tourne... youpi.'
    print '[ctrl-C] pour stoper le server'
    print '=> http://localhost:{}'.format(port)
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

if len(argv) == 2:
    run(port=int(argv[1]))
else:
    run()