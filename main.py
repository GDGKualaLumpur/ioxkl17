#!/usr/bin/env python
#
# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__author__ = 'Eric Bidelman <ebidel@>'

import os
import sys
import webapp2

from google.appengine.ext.webapp import template

import http2push as http2


class MainHandler(http2.PushHandler):

  @http2.push('push-manifest.json')
  def get(self, *args, **kwargs):
    path = os.path.join(os.path.dirname(__file__), 'build/appspot/index.html')
    return self.response.write(template.render(path, {}))

app = webapp2.WSGIApplication([
    ('/.*', MainHandler),
], debug=True)