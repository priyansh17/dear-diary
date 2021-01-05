import sys
import random

standup = ['QKBJXjChDHw',

           'KQb4d9N-sQw',

           'K5A1RezhxMU',

           '00uSdO8DefQ',

           'c7QYEedjb_o',

           'in4RXMJlEVk',

           'dtaJzUbQS7E',

           'uvqD_VUZI24',

           'mPCDQ34S8Rs',

           'Tqsz6fjvhZM',

           'wQA68Oqr1qE',

           'z12bz7adLKI',

           'NVphWvObKL8',

           'e7PNRC3iSTs',

           'zqBHAsdmVBc',

           'cQZnUeoaEEE',

           'hDzia4qT3O8',

           'YtrHyHqdp8Y',

           '2V1shb3Mi4s',

           'Ehgj5ZPCS04', ]

dance = ['Q10cs2QJgeo',

         'zUDXj8REpAI',

         'hEsofW-h6zA',

         'Xw6k6Ma0oqo',

         'aj2yjPHGVX0',

         'Voiae2-E-7Y',

         'YcXEA1xkQKg',

         'FFtzqqgE3kA',

         '1oCGtwW3Cfw',

         'LRXMn2zoXBc',

         'FZjq6YAuSug',

         '_lgcmYSePGA',

         'ZLMvyfjq4YU',

         '2VTWn9TA8Qw',

         'Mz07DQg3ajk',

         'p-rSdt0aFuw',

         '7yp01iNQBeI',

         'BJy6sR0-MVQ']

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

songs = ['eJrl5Ofnp8Q',

         '403FGqa-Uv8',

         'vMLk_T0PPbk',

         'TMb0Q7O6nN4',

         'iN9zkskjdGI',

         'XEyhoB-hUrE',

         'dc89yyOS0Z8',

         '8Wb04PvJO5Y',

         'h3uJKEDsyCM',

         '76Wygb_Aqz0',

         'BrnDlRmW5hs',

         '0yFLDOCoEHE',

         '14zIhlfeUjE',

         'VGP6JP_hAPM']

ret_lst = []


def lev5(list1):
    index = 0
    for i in range(0, 8):
        if list1[i] == 2:
            ret_lst.append(random.choice(dance))
            index += 1
        if list1[i] == 5:
            ret_lst.append(random.choice(songs))
            index += 1
        if list1[i] == 6:
            ret_lst.append(random.choice(standup))
            index += 1
        if list1[i] == 8:
            ret_lst.append(random.choice(story_books))
            index += 1
        if index >= 4:
            return ret_lst
