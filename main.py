import webapp2

class MainHandler(webapp2.RequestHandler):

  def get(self, *args, **kwargs):
    self.redirect('//' + self.request.host + '/ioxkl17/')

app = webapp2.WSGIApplication([
    ('/ioxkl17.*', MainHandler),
], debug=True)