def get_president_and_party(year):

    if year >=   2021: return {"president":"?",         "party":"?",            "color":"grey"}
    elif year >= 2017: return {"president":"Trump",     "party":"Republican",   "color":"red"}
    elif year >= 2009: return {"president":"Obama",     "party":"Democratic",   "color":"blue"}
    elif year >= 2001: return {"president":"Bush",      "party":"Republican",   "color":"red"}
    elif year >= 1993: return {"president":"Clinton",   "party":"Democratic",   "color":"blue"}
    elif year >= 1989: return {"president":"Bush",      "party":"Republican",   "color":"red"}
    elif year >= 1981: return {"president":"Reagan",    "party":"Republican",   "color":"red"}
    elif year >= 1977: return {"president":"Carter",    "party":"Democratic",   "color":"blue"}
    elif year >= 1974: return {"president":"Ford",      "party":"Republican",   "color":"red"}
    elif year >= 1969: return {"president":"Nixon",     "party":"Republican",   "color":"red"}
    elif year >= 1963: return {"president":"Johnson",   "party":"Democratic",   "color":"blue"}
    elif year >= 1961: return {"president":"Kennedy",   "party":"Democratic",   "color":"blue"}
    elif year >= 1953: return {"president":"Eisenhower","party":"Republican",   "color":"red"}
    elif year >= 1945: return {"president":"Truman",    "party":"Democratic",   "color":"blue"}
    elif year >= 1933: return {"president":"Roosevelt", "party":"Democratic",   "color":"blue"}
    elif year >= 1929: return {"president":"Hoover",    "party":"Republican",   "color":"red"}
    elif year >= 1923: return {"president":"Coolidge",  "party":"Republican",   "color":"red"}
    elif year >= 1921: return {"president":"Harding",   "party":"Republican",   "color":"red"}
    elif year >= 1913: return {"president":"Wilson",    "party":"Democratic",   "color":"blue"}
    elif year >= 1909: return {"president":"Taft",      "party":"Republican",   "color":"red"}
    elif year >= 1901: return {"president":"Roosevelt", "party":"Republican",   "color":"red"}
    elif year >= 1897: return {"president":"McKinley",  "party":"Republican",   "color":"red"}
    elif year >= 1893: return {"president":"Cleveland", "party":"Democratic",   "color":"blue"}
    elif year >= 1889: return {"president":"Harrison",  "party":"Republican",   "color":"red"}
    elif year >= 1885: return {"president":"Cleveland", "party":"Democratic",   "color":"blue"}
    elif year >= 1881: return {"president":"Arthur",    "party":"Republican",   "color":"red"}
    elif year >= 1877: return {"president":"Hayes",     "party":"Republican",   "color":"red"}
    elif year >= 1869: return {"president":"Grant",     "party":"Republican",   "color":"red"}
    elif year >= 1865: return {"president":"Johnson",   "party":"Democratic",   "color":"blue"}
    elif year >= 1861: return {"president":"Lincoln",   "party":"Republican",   "color":"red"}
    elif year >= 1857: return {"president":"Buchanan",  "party":"Democratic",   "color":"blue"}
    elif year >= 1853: return {"president":"Pierce",    "party":"Democratic",   "color":"blue"}
    elif year >= 1850: return {"president":"Filmore",   "party":"Whig",         "color":"purple"}
    elif year >= 1849: return {"president":"Taylor",    "party":"Whig",         "color":"purple"}
    elif year >= 1845: return {"president":"Polk",      "party":"Democratic",   "color":"blue"}
    elif year >= 1841: return {"president":"Tyler",     "party":"Whig",         "color":"purple"}
    elif year >= 1837: return {"president":"Van Buren", "party":"Democratic",   "color":"blue"}
    elif year >= 1829: return {"president":"Jackson",   "party":"Democratic",   "color":"blue"}
    elif year >= 1825: return {"president":"Adams",     "party":"Democratic-Republican",   "color":"green"}
    elif year >= 1817: return {"president":"Monroe",    "party":"Democratic-Republican",   "color":"green"}
    elif year >= 1809: return {"president":"Madison",   "party":"Democratic-Republican",   "color":"green"}
    elif year >= 1801: return {"president":"Jefferson", "party":"Democratic-Republican",   "color":"green"}
    elif year >= 1797: return {"president":"Adams",     "party":"Federalist",   "color":"salmon"}
    elif year >= 1789: return {"president":"Washington","party":"Unaffiliated",   "color":"grey"}
    else: return {"president":"?", "party":"?", "color":"grey"}


