import sys
import random

story_books = ['1oxyBAbL_0k',
               'YovS_kqfXaA',
               '-YzZijLr-bo',
               '6JnmIQxRZwI',
               'HsJlKYHoP10',
               'aEYXiZ1qx90',
               'nRGrEcvsg9U',
               'Wi5Y0mDLcQs',
               'rhXz6D0gtP8',
               'i70GnS75n1E',
               'FBHXj4KryOQ',
               'iEq0dMu9vpk',
               'j-QUDT4KOUg',
               'kw-Mz0-zSUg',
               'Akj060VYSmI',
               'UOTta-pTgoU',
               '6wBP7h2T1o4']

story2 = ['rmeGVhhbGrM',
          'sVPYIRF9RCQ',
          'jfqj7Qs-9Is',
          'QEpCG6suios',
          'zzIMNr49-j0',
          'V6ui161NyTg',
          'kiXCLSXL38Q',
          'NjxwxZKgW3w',
          'Aw46a7BzJhI',
          'sU6LZPJyzBs',
          'CaVaF6TkSUU',
          '2bguEiUgDA4',
          'DTcJmIbn5nw',
          'arj7oStGLkU',
          'Bu_Upb4rXXw',
          'V9V7k7dm86c',
          'zls4a7I_qaM',
          'iQaiMoUn-zc',
          '7sxpKhIbr0E',
          'sB34sRehUvU',
          'LNHBMFCzznE',
          'wTQKsZWndCc',
          'le6eNngljto',
          'iCvmsMzlF7o',
          'M4vqr3_ROIk',
          'xjBIsp8mS-c',
          'YrtANPtnhyg',
          'SRI1jWcUgKA',
          'TFbv757kup4']

music2 = ['L6iPH1gsYVY',
          'd-uyxvQ7fb4',
          's0WCU3VVISE',
          'ztyx81cZRbc',
          'EyJ6jjO6FdE',
          'fBVJoIbNjdQ',
          'ooOSTEouYCs',
          'aIIEI33EUqI',
          'nSkfkCuEDZQ',
          '9BD1y0TOk3o',
          'cpTOUerrT30',
          'gtmzPUmq7XU',
          '7HeVWOnju-Y',
          'jZkOR1LF-9I',
          'YxfnUPqWV0k',
          '_opwSQeuBs0',
          'hF7BkvLJwqg',
          'FA8tl0fsYdI',
          'iLuiD1LTScA',
          'BklGhQYKl30',
          'XHeLr1kHNB8',
          'hF7BkvLJwqg']

biography = ['Rb2HaLd4D_E',
             'oxiJ02-hpZY',
             'Kle85Z1dJ2g',
             'OZfDV6-3qA4']

ret_lst = []


def lev4(list1):
    index = 0
    for i in range(0, 8):
        if list1[i] == 1:
            ret_lst.append(random.choice(biography))
            index += 1
        if list1[i] == 4:
            ret_lst.append(random.choice(music2))
            index += 1
        if list1[i] == 7:
            ret_lst.append(random.choice(story2))
            index += 1
        if list1[i] == 8:
            ret_lst.append(random.choice(story_books))
            index += 1
        if index >= 4:
            return ret_lst
