    
def shuffle_list(source):

    import random
    import math
    random_integers = []
    target = []
    
    while len(random_integers) < len(source):
        random_integer = math.floor(random.random() * len(source))
        try:
            random_integers.index(random_integer)
        except ValueError:
            random_integers.append(random_integer)

    for random_integer in random_integers:
        target.append(source[random_integer])

    return target

def format_name_from_key(key):

    name = key.replace("_", " ")

    name = name.title()

    return name