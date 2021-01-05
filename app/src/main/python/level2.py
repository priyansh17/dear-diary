import sys
import random

standup2 = ['5zn4UDOxjGg',
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

vlog2 = ['Qmi-Xwq-MEc9',
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
         ]

story = ['rdmQwCopmMc',

         'Zg2yr4tRnpo',

         'Pfbnc-u8Ta4',

         'EVNNzwHWq78',

         'QAsJvKsd2Xk',

         '11ftPmTcwF',

         'O8jq3MfWp4o',

         'quw62_xVEj8',

         'EnpeQ5gVSng']

ret_lst = []


def lev2(list1):
    index = 0
    for i in range(0, 8):
        if list1[i] == 4:
            ret_lst.append(random.choice(music))
            index += 1
        if list1[i] == 6:
            ret_lst.append(random.choice(standup2))
            index += 1
        if list1[i] == 7:
            ret_lst.append(random.choice(story))
            index += 1
        if list1[i] == 9:
            ret_lst.append(random.choice(vlog2))
            index += 1
        if index >= 4:
            return ret_lst
