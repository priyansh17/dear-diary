import sys
import random

biography = ['Rb2HaLd4D_E',
             'oxiJ02-hpZY',
             'Kle85Z1dJ2g',
             'OZfDV6-3qA4']

mind_teaser = ['be9RJp4f4Pc',
               'nSbvlktToSY',
               'N5vJSNXPEwA',
               '7yDmGnA8Hw0',
               'LKvjIsyYng8',
               'mmkCS5eA4f8',
               '2WdBgqZ4ZbY',
               'R0RzVrvmntM',
               'Gz5_9MB0e-0',
               '2PD55fyRBxI',
               'ugAUMbceVNU',
               '-dOIyT3nrr0',
               'HDPOPMYsDrQ',
               '0SoI83ukWa0',
               'Sa1uaalnT_k',
               'aP2JTrcFMU0',
               'k859CzEn4R0',
               '_7pu1R6sCrs',
               'be9RJp4f4Pc',
               'NmUgHsCP3qo',
               'D99Ok4wJ8uo',
               'UvQ0tTS8CTo']

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

           'Ehgj5ZPCS04',
           '5zn4UDOxjGg',
           '6T_s8avdgG0',
           '_2lwqbgaHU0',
           'OqkOj9e1dcA',
           'ufHrTI_E4Kk',
           'TEsa9ohLfUQ',
           'Cdsnc70Un14',
           '2Oy4HpUJSgE',
           '8bPWXYM2ysU',
           'aTUiGWJinX0',
           '7V6FGF1ffgQ',
           'Tqsz6fjvhZM',
           'SFr09mJHliE',
           'GCEXzUthGMo',
           'P6aPg3YBvBQ',
           'vccwHvCIuW8',
           'uvqD_VUZI24']

vlogs = ['gtm2O_6_mUM',

         'hLk1Uxnw-iA',

         'hVJqH0n04Bs',

         'LclR9uqrGN4',

         'pocIX2vTIzw',

         'hWr2e0vQaLA',

         'gALu0cHQais',

         'uNASBZko99A?t=7',

         'oaoyqvL06Wk',

         'Aru38NdYDQo?t=4'

         'Qmi-Xwq-MEc9',
         '4peMgTL28ts',
         '1Qb22Y8lRhw',
         '5z6KwOqYNJc',
         'sr284c-q8oY',
         'Xp9_HobpQnc',
         'lgaVKqYwC6s',
         '-ix7a3-7ekw',
         '8Ulrn4D3M_Y',
         'fDMu9BXMR-U',
         'i_ZzyaxdcIE',
         'PqZtT_7NpRg',
         '_mLn99CQubI',
         'uA5XuOIilYc',
         'XPgoeEh2lNo',
         '7bv_eqtkKqQ',
         'aztbvh4W8y0',
         'qi52KQs67MY',
         'r3fE6FQT82s',
         '1udJsv1VcII',
         'hdA03p6egdg',
         'fEErySYqItI']

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

music = ['8wVtNyJN-pA',

         'ZL4YqdetFf8',

         '7pmxO9fHBHk',

         'RhZfulT4zSE',

         '-J_iSq1m7L4',

         'hTUJfmeJ1MU',

         '6evBoYmNpq0',

         'Uh3GzIZpShI',

         'UIiVIZxtpxQ?t=21',

         '5MXpQYaekAA',

         'x6UITRjhijI'

         'MN44hrV4trg'

         's0WCU3VVISE'

         'lCOF9LN_Zxs'

         '-b4BjxrIp8o'

         'ooOSTEouYCs'

         'VADfDjLrYRA?t=68'

         'OwoV7SRCFv4'

         'R934Tn0Ebfw'

         '1e2hBzSa920?t=5'

         'lpNgST3RX4Q'

         'DIi-pBpXIbE'
         'L6iPH1gsYVY',
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

story = ['rdmQwCopmMc',

         'Zg2yr4tRnpo',

         'Pfbnc-u8Ta4',

         'EVNNzwHWq78',

         'QAsJvKsd2Xk',

         '11ftPmTcwF',

         'O8jq3MfWp4o',

         'quw62_xVEj8',

         'EnpeQ5gVSng'
         'rmeGVhhbGrM',
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

ret_lst = []


def by_def(list1):
    index = 0
    for j in range(0, 2):
        if list1[j] == 1:
            for i in range(0, 2):
                ret_lst.append(random.choice(biography))
        if list1[j] == 2:
            for i in range(0, 2):
                ret_lst.append(random.choice(dance))
        if list1[j] == 3:
            for i in range(0, 2):
                ret_lst.append(random.choice(mind_teaser))
        if list1[j] == 4:
            for i in range(0, 2):
                ret_lst.append(random.choice(music))
        if list1[j] == 5:
            for i in range(0, 2):
                ret_lst.append(random.choice(songs))
        if list1[j] == 6:
            for i in range(0, 2):
                ret_lst.append(random.choice(standup))
        if list1[j] == 7:
            for i in range(0, 2):
                ret_lst.append(random.choice(story))
        if list1[j] == 8:
            for i in range(0, 2):
                ret_lst.append(random.choice(story_books))
        if list1[j] == 9:
            for i in range(0, 2):
                ret_lst.append(random.choice(vlogs))
    return ret_lst
