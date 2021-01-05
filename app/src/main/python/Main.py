from collections import Counter
import sys
import re
import nltk
nltk.download('stopwords')
nltk.download('vader_lexicon')
from nltk.corpus import stopwords as sw
from nltk.sentiment.vader import SentimentIntensityAnalyzer as vl
from textblob import TextBlob
import recommender as r1
from bs4 import BeautifulSoup
import level1 as l1
import level2 as l2
import level3 as l3
import level4 as l4
import level5 as l5
import level6 as l6




def emotion(text):
    lower_case = text.lower()

    # Removing punctuations
    # cleaned_text = lower_case.translate(str.maketrans('', '', string.punctuation))

    cleaned_text = re.sub("[?,.!""']", " ", lower_case)

    # splitting text into words
    tokenized_words = cleaned_text.split()

    """"stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
                  "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
                  "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these",
                  "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
                  "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
                  "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
                  "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
                  "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
                  "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
                  "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]"""

    # Removing stop words from the tokenized words list
    final_words = []
    for word in tokenized_words:
        if word not in sw.words('english'):
            final_words.append(word)

    # NLP Emotion Algorithm
    # 1) Check if the word in the final word list is also present in emotion.txt
    #  - open the emotion file
    #  - Loop through each line and clear it
    #  - Extract the word and emotion using split

    # 2) If word is present -> Add the emotion to emotion_list
    # 3) Finally count each emotion in the emotion list

    def listToString(s):
        # initialize an empty string
        str1 = " "
        return str1.join(s)

    def find_ngrams(n, a):
        # Split sentence into tokens.
        input_sequence = listToString(a)

        tokens = input_sequence.split()

        ngrams = []
        for i in range(len(tokens) - n + 1):
            # Take n consecutive tokens in array.
            ngram = tokens[i:i + n]
            # Concatenate array items into string.
            ngram = ' '.join(ngram)
            ngrams.append(ngram)

        return ngrams

    ngrams = find_ngrams(3, final_words)
    analysis = {}

    for ngram in ngrams:
        blob = TextBlob(ngram)
        print('Ngram: {}'.format(ngram))
        print('Polarity: {}'.format(blob.sentiment.polarity))

    emotion_list = []
    from os.path import dirname, join
    f = open(join(dirname(__file__), 'emotions.txt'))
    #f= open("emotions.txt","r").read()
    #with open('C:/Users/KIIT/Downloads/New folder/BrainRelief/app/src/main/python/emotions.txt', 'r') as file:
    for line in f:
        if line:
            clear_line = line.replace("\n", '').replace(",", '').replace("'", '').strip()
            word, emotion = clear_line.split(':')

        if word in final_words:
            emotion_list.append(emotion)
    return emotion_list

def counters(emotion_list):
    w = Counter(emotion_list)
    return w

def scores(text):
    lower_case = text.lower()
    cleaned_text = re.sub("[?,.!""']", " ", lower_case)
    score = vl().polarity_scores(cleaned_text)
    return score


def typeOfSentiment(text):
    lst = []
    lower_case = text.lower()
    cleaned_text = re.sub("[?,.!""']", " ", lower_case)
    score = vl().polarity_scores(cleaned_text)
    a = score['neg']
    b = score['pos']
    if(a<b):
        lst.append("Positive Sentiment")
    elif(a>b):
        lst.append("Negative Sentiment")
    else:
        lst.append("Neutral Sentiment")
    if (a > b):
        if a > 0 and a <= 0.25:
            lst.append("Level 1")
        if a > 0.25 and a <= 0.5:
            lst.append("Level 2")
        if a > 0.5 and a <= 0.75:
            lst.append("Level 3")
        if a > 0.75 and a <= 1:
            lst.append("Level 4")
    elif a < b:
        lst.append("Positive Sentiment")
    else:
        lst.append("Neutral Sentiment")

    return  lst
# text = input(random.choice(questions))

def main(text,listToReturn):
    # converting to lowercase
    lower_case = text.lower()
    # Removing punctuations
    # cleaned_text = lower_case.translate(str.maketrans('', '', string.punctuation))

    cleaned_text = re.sub("[?,.!""']", " ", lower_case)

    # splitting text into words
    tokenized_words = cleaned_text.split()

    """"stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
                  "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
                  "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these",
                  "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
                  "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
                  "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
                  "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
                  "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
                  "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
                  "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]"""

    # Removing stop words from the tokenized words list
    final_words = []
    for word in tokenized_words:
        if word not in sw.words('english'):
            final_words.append(word)

    # NLP Emotion Algorithm
    # 1) Check if the word in the final word list is also present in emotion.txt
    #  - open the emotion file
    #  - Loop through each line and clear it
    #  - Extract the word and emotion using split

    # 2) If word is present -> Add the emotion to emotion_list
    # 3) Finally count each emotion in the emotion list

    def listToString(s):
        # initialize an empty string
        str1 = " "
        return str1.join(s)

    def find_ngrams(n, a):
        # Split sentence into tokens.
        input_sequence = listToString(a)

        tokens = input_sequence.split()

        ngrams = []
        for i in range(len(tokens) - n + 1):
            # Take n consecutive tokens in array.
            ngram = tokens[i:i + n]
            # Concatenate array items into string.
            ngram = ' '.join(ngram)
            ngrams.append(ngram)

        return ngrams

    ngrams = find_ngrams(3, final_words)
    analysis = {}

    for ngram in ngrams:
        blob = TextBlob(ngram)
        print('Ngram: {}'.format(ngram))
        print('Polarity: {}'.format(blob.sentiment.polarity))

    emotion_list = []
    from os.path import dirname, join
    f = open(join(dirname(__file__), 'emotions.txt'))
    #f= open("emotions.txt","r").read()
    #with open('C:/Users/KIIT/Downloads/New folder/BrainRelief/app/src/main/python/emotions.txt', 'r') as file:
    for line in f:
        if line:
            clear_line = line.replace("\n", '').replace(",", '').replace("'", '').strip()
            word, emotion = clear_line.split(':')

        if word in final_words:
            emotion_list.append(emotion)

    print(emotion_list)
    w = Counter(emotion_list)
    print(w)

    score = vl().polarity_scores(cleaned_text)
    a = score['neg']
    b = score['pos']
    print(score)

    bar = 1
    am = 1
    if (a > b):
        print("Negative Sentiment")
        if a > 0 and a <= 0.25:
            bar = 1
            print("Level 1")
            am = r1.main(1)
        if a > 0.25 and a <= 0.5:
            bar = 2
            print("Level 2")
            am = r1.main(2)
        if a > 0.5 and a <= 0.75:
            bar = 3
            print("Level 3")
            am = r1.main(3)
        if a > 0.75 and a <= 1:
            bar = 4
            print("Level 4")
            am = r1.main(4)
    elif a < b:
        print("Positive Sentiment")
        bar = 5
        am = r1.main(5)
    else:
        print("Neutral Sentiment")
        bar = 6
        am = r1.main(5)
    count = 0
    lst = []
    demo = []
    if bar == 1 or bar == 2 or bar == 3 or bar == 4:
        print("\nWant to watch some movies\n")
        for i in am:

            # Splitting each line of the
            # IMDb data to scrape movies
            tmp = str(i).split('>')

            if len(tmp) == 3:
                lst.append(tmp[1][:-3])

            if (count > 13):
                break
            count += 1
    else:
        print("\nWant to watch some movies\n")
        for i in am:
            tmp = str(i).split('>')

            if len(tmp) == 3:
                lst.append(tmp[1][:-3])


            if (count > 11):
                break
            count += 1

    if bar == 1:
        demo = l1.lev1(listToReturn)
    elif bar == 2:
        demo = l2.lev2(listToReturn)
    elif bar == 3:
        demo = l3.lev3(listToReturn)
    elif bar == 4:
        demo = l4.lev4(listToReturn)
    elif bar == 5:
        demo = l5.lev5(listToReturn)
    elif bar == 6:
        demo = l6.lev6(listToReturn)
    return lst,demo


def main2(text):
    # converting to lowercase
    lower_case = text.lower()


    cleaned_text = re.sub("[?,.!""']", " ", lower_case)

    # splitting text into words
    tokenized_words = cleaned_text.split()

    """"stop_words = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
                  "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
                  "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these",
                  "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
                  "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
                  "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
                  "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
                  "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
                  "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
                  "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]"""

    final_words = []
    for word in tokenized_words:
        if word not in sw.words('english'):
            final_words.append(word)


    def listToString(s):
        # initialize an empty string
        str1 = " "
        return str1.join(s)

    def find_ngrams(n, a):
        # Split sentence into tokens.
        input_sequence = listToString(a)

        tokens = input_sequence.split()

        ngrams = []
        for i in range(len(tokens) - n + 1):
            # Take n consecutive tokens in array.
            ngram = tokens[i:i + n]
            # Concatenate array items into string.
            ngram = ' '.join(ngram)
            ngrams.append(ngram)

        return ngrams

    ngrams = find_ngrams(3, final_words)
    analysis = {}

    for ngram in ngrams:
        blob = TextBlob(ngram)
        print('Ngram: {}'.format(ngram))
        print('Polarity: {}'.format(blob.sentiment.polarity))

    emotion_list = []
    from os.path import dirname, join
    f = open(join(dirname(__file__), 'emotions.txt'))

    for line in f:
        if line:
            clear_line = line.replace("\n", '').replace(",", '').replace("'", '').strip()
            word, emotion = clear_line.split(':')

        if word in final_words:
            emotion_list.append(emotion)

    print(emotion_list)
    w = Counter(emotion_list)
    print(w)

    score = vl().polarity_scores(cleaned_text)
    a = score['neg']
    b = score['pos']
    print(score)

    bar = 1
    am = 1
    if (a > b):
        print("Negative Sentiment")
        if a > 0 and a <= 0.25:
            bar = 1
            print("Level 1")
            am = r1.main(1)
        if a > 0.25 and a <= 0.5:
            bar = 2
            print("Level 2")
            am = r1.main(2)
        if a > 0.5 and a <= 0.75:
            bar = 3
            print("Level 3")
            am = r1.main(3)
        if a > 0.75 and a <= 1:
            bar = 4
            print("Level 4")
            am = r1.main(4)
    elif a < b:
        print("Positive Sentiment")
        bar = 5
        am = r1.main(5)
    else:
        print("Neutral Sentiment")
        bar = 5
        am = r1.main(5)
    count = 0
    lst = []
    demo= []
    if bar == 1 or bar == 2 or bar == 3 or bar == 4:
        print("\nWant to watch some movies\n")
        for i in am:

            # Splitting each line of the
            # IMDb data to scrape movies
            tmp = str(i).split('>')

            if len(tmp) == 3:
                lst.append(tmp[1][:-3])

            if (count > 13):
                break
            count += 1
    else:
        print("\nWant to watch some movies\n")
        for i in am:
            tmp = str(i).split('>')

            if len(tmp) == 3:
                lst.append(tmp[1][:-3])

            if (count > 11):
                break
            count += 1
    return lst

