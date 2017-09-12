import webapp2

class SlashRedirect(webapp2.RequestHandler):
  def get(self, *args, **kwargs):
    self.redirect('//' + self.request.host + '/ioxkl17/')

class Io17extended(webapp2.RequestHandler):
  def get(self, *args, **kwargs):
    path = self.request.path_qs.split('/')
    if (path[1] != 'io17extended'):
        self.redirect('https://www.gdgkl.org')
    else:
        self.redirect('//' + self.request.host + '/ioxkl17/' + '/'.join(path[2:]))

app = webapp2.WSGIApplication([
    ('/ioxkl17.*', SlashRedirect),
    ('/io17extended.*', Io17extended)
], debug=True)