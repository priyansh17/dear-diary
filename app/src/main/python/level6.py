import sys
import random

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

vlogs = ['gtm2O_6_mUM',

         'hLk1Uxnw-iA',

         'hVJqH0n04Bs',

         'LclR9uqrGN4',

         'pocIX2vTIzw',

         'hWr2e0vQaLA',

         'gALu0cHQais',

         'uNASBZko99A?t=7',

         'oaoyqvL06Wk',

         'Aru38NdYDQo?t=4']

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

ret_lst = []


def lev6(list1):
    index = 0
    for i in range(0, 8):
        if list1[i] == 2:
            ret_lst.append(random.choice(dance))
            index += 1
        if list1[i] == 3:
            ret_lst.append(random.choice(mind_teaser))
            index += 1
        if list1[i] == 5:
            ret_lst.append(random.choice(songs))
            index += 1
        if list1[i] == 9:
            ret_lst.append(random.choice(vlogs))
            index += 1
        if index >= 4:
            return ret_lst
