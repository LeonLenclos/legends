from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import json
import os


class S(BaseHTTPRequestHandler):

    def do_GET(self):
        self.path = self.path.split('?')[0]
        if self.path == '/':
            self.path = '/editor/index.html'
        try:
            with open('.' + self.path, "r") as f:
                page = f.read()
                self.send_response(200)

        except IOError:
            self.send_response(404)
            page = ""; 
        self.end_headers()

        self.wfile.write(page)


    def do_POST(self):
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        if self.path == '/auto_assets':
            print "mise a jour de assets.json"

            assets = {
                'json':[],
                'png':[]
            }
            for directory, _, files in os.walk('game/assets/json'):
                for fi in files:
                    p = directory+'/'+fi.split('.')[0]
                    assets['json'].append(p[len('game/assets/json/'):])
            for directory, _, files in os.walk('game/assets/img'):
                for fi in files:
                    p = directory+'/'+fi.split('.')[0]
                    assets['png'].append(p[len('game/assets/img/'):])

            with open('game/assets/json/assets.json', "w") as outfile:
                json.dump(assets, outfile, indent=2)

        if self.path == '/set_json':
            print "creation/mise a jour d'un fichier json"

            print self.data_string

            data = json.loads(self.data_string)

            with open(data["path"], "w") as outfile:
                json.dump(data["data"], outfile, indent=2)
            self.send_response(200)
            self.end_headers()

        return


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