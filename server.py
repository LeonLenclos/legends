from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import json


class S(BaseHTTPRequestHandler):

    def do_GET(self):
        self.path = self.path.split('?')[0]
        if self.path == '/':
            self.path = '/editor/index.html'
        try:
            with open('.' + self.path, "r") as f:
                page = f.read()
                self.send_response(200)

        except FileNotFoundError:
            self.send_response(404)
            page = ""; 
        self.end_headers()

        self.wfile.write(page)


    def do_POST(self):
        print "in post method"
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()

        data = json.loads(self.data_string)
        with open(data.path, "w") as outfile:
            json.dump(data.data, outfile)
        return


def run(server_class=HTTPServer, handler_class=S, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Le serveur tourne...'
    print '=> http://localhost:{}'.format(port)
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

if len(argv) == 2:
    run(port=int(argv[1]))
else:
    run()