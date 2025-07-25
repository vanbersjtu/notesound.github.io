from http.server import HTTPServer, SimpleHTTPRequestHandler
import mimetypes

# 扩展MIME类型映射以支持MP4
mimetypes.add_type('video/mp4', '.mp4')

class CustomRequestHandler(SimpleHTTPRequestHandler):
    # 重写guess_type方法以确保正确的MIME类型
    def guess_type(self, path):
        mime_type, _ = mimetypes.guess_type(path)
        return mime_type or 'application/octet-stream'

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CustomRequestHandler)
    print(f'Starting custom server on http://localhost:8000')
    httpd.serve_forever()