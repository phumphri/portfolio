import copy
import json


class Properties:

    def __init__(self):

        self.properties = {}

        self.properties[0] = {
            "type": "go",
            "name": "Go",
            "row": 10,
            "column": 10,
            "salary": 200}

        self.properties[1] = {
            "type": "property",
            "name": "Mediterranean Avenue",
            "owner_key": 0,
            "color": "Brown",
            "row": 10,
            "column": 9,
            "price": 60,
            "mortgage": 30,
            "mortgaged": False,
            "rent": 2,
            "building_cost": 50,
            "houses": 0,
            "house_rents": [10, 30, 90, 160],
            "hotels": 0,
            "hotel_rent": 250}

        self.properties[2] = {
            "type": "community_chest",
            "name": "Community Chest",
            "row": 10,
            "column": 8}

        self.properties[3] = {
            "type": "property",
            "name": "Baltic Avenue",
            "owner_key": 0,
            "color": "Brown",
            "row": 10,
            "column": 7,
            "price": 60,
            "rent": 4,
            "building_cost": 50,
            "houses": 0,
            "house_rents": [20, 60, 180, 320],
            "hotels": 0,
            "hotel_rent": 450,
            "mortgage": 30,
            "mortgaged": False}

        self.properties[4] = {
            "type": "tax",
            "name": "Income Tax",
            "row": 10,
            "column": 6,
            "tax": 200}

        self.properties[5] = {
            "type": "railroad",
            "name": "Reading Railroad",
            "owner_key": 0,
            "color": "Black",
            "row": 10,
            "column": 5,
            "price": 200,
            "mortgage": 100,
            "mortgaged": False}

        self.properties[6] = {
            "type": "property",
            "name": "Oriental Avenue",
            "owner_key": 0,
            "color": "LightBlue",
            "row": 10,
            "column": 4,
            "price": 100,
            "rent": 6,
            "building_cost": 50,
            "houses": 0,
            "house_rents": [30, 90, 270, 400],
            "hotels": 0,
            "hotel_rent": 550,
            "mortgage": 50,
            "mortgaged": False}

        self.properties[7] = {
            "type": "chance",
            "name": "Chance",
            "row": 10,
            "column": 3}

        self.properties[8] = {
            "type": "property",
            "name": "Vermont Avenue",
            "owner_key": 0,
            "color": "LightBlue",
            "row": 10,
            "column": 2,
            "price": 100,
            "rent": 6,
            "houses": 0,
            "building_cost": 50,
            "house_rents": [30, 90, 270, 400],
            "hotels": 0,
            "hotel_rent": 550,
            "mortgage": 50,
            "mortgaged": False}

        self.properties[9] = {
            "type": "property",
            "name": "Connecticut Avenue",
            "owner_key": 0,
            "color": "LightBlue",
            "row": 10,
            "column": 1,
            "price": 120,
            "rent": 8,
            "building_cost": 50,
            "houses": 0,
            "house_rents": [40, 100, 300, 450],
            "hotels": 0,
            "hotel_rent": 600,
            "mortgage": 60,
            "mortgaged": False}

        self.properties[10] = {
            "type": "jail",
            "name": "Jail",
            "row": 10,
            "column": 0,
            "fine": 50}

        self.properties[11] = {
            "type": "property",
            "name": "St. Charles Place",
            "owner_key": 0,
            "color": "Purple",
            "row": 9,
            "column": 0,
            "price": 140,
            "rent": 10,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [50, 150, 450, 625],
            "hotels": 0,
            "hotel_rent": 750,
            "mortgage": 70,
            "mortgaged": False}

        self.properties[12] = {
            "type": "utility",
            "name": "Electric Company", 
            "owner_key": 0,
            "color": "DarkSlateGrey",
            "price": 150,
            "row": 8,
            "column": 0,
            "mortgage": 75,
            "mortgaged": False}

        self.properties[13] = {
            "type": "property",
            "name": "States Avenue",
            "owner_key": 0,
            "color": "Purple",
            "row": 7,
            "column": 0,
            "price": 140,
            "rent": 10,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [50, 150, 450, 625],
            "hotels": 0,
            "hotel_rent": 750,
            "mortgage": 70,
            "mortgaged": False}

        self.properties[14] = {
            "type": "property",
            "name": "Virginia Avenue",
            "owner_key": 0,
            "color": "Purple",
            "row": 6,
            "column": 0,
            "price": 160,
            "rent": 12,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [60, 180, 500, 700],
            "hotels": 0,
            "hotel_rent": 900,
            "mortgage": 80,
            "mortgaged": False}

        self.properties[15] = {
            "type": "railroad",
            "name": "Pennsylvania Railroad",
            "owner_key": 0,
            "color": "Black",
            "price": 200,
            "row": 5,
            "column": 0,
            "mortgage": 100,
            "mortgaged": False}

        self.properties[16] = {
            "type": "property",
            "name": "St. James Place",
            "owner_key": 0,
            "color": "Orange",
            "row": 4,
            "column": 0,
            "price": 180,
            "rent": 14,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [70, 200, 550, 750],
            "hotels": 0,
            "hotel_rent": 950,
            "mortgage": 90,
            "mortgaged": False}

        self.properties[17] = {
            "type": "community_chest",
            "name": "Community Chest",
            "row": 3,
            "column": 0}

        self.properties[18] = {
            "type": "property",
            "name": "Tennessee Avenue",
            "owner_key": 0,
            "color": "Orange",
            "row": 2,
            "column": 0,
            "price": 180,
            "rent": 14,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [70, 200, 550, 750],
            "hotels": 0,
            "hotel_rent": 950,
            "mortgage": 90,
            "mortgaged": False}

        self.properties[19] = {
            "type": "property",
            "name": "New York Avenue",
            "owner_key": 0,
            "color": "Orange",
            "row": 1,
            "column": 0,
            "price": 200,
            "rent": 16,
            "building_cost": 100,
            "houses": 0,
            "house_rents": [80, 220, 600, 800],
            "hotels": 0,
            "hotel_rent": 1000,
            "mortgage": 100,
            "mortgaged": False}

        self.properties[20] = {
            "type": "free_parking",
            "name": "Free Parking",
            "row": 0,
            "column": 0}

        self.properties[21] = {
            "type": "property",
            "name": "Kentucky Avenue",
            "owner_key": 0,
            "color": "Red",
            "row": 0,
            "column": 1,
            "price": 220,
            "rent": 18,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [90, 250, 700, 875],
            "hotels": 0,
            "hotel_rent": 1050,
            "mortgage": 110,
            "mortgaged": False}

        self.properties[22] = {
            "type": "chance",
            "name": "Chance",
            "row": 0,
            "column": 2}

        self.properties[23] = {
            "type": "property",
            "name": "Indiana Avenue",
            "owner_key": 0,
            "color": "Red",
            "row": 0,
            "column": 3,
            "price": 220,
            "rent": 18,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [90, 250, 700, 875],
            "hotels": 0,
            "hotel_rent": 1050,
            "mortgage": 110,
            "mortgaged": False}

        self.properties[24] = {
            "type": "property",
            "name": "Illinois Avenue",
            "owner_key": 0,
            "color": "Red",
            "row": 0,
            "column": 4,
            "price": 240,
            "rent": 20,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [100, 300, 750, 925],
            "hotels": 0,
            "hotel_rent": 1100,
            "mortgage": 120,
            "mortgaged": False}

        self.properties[25] = {
            "type": "railroad",
            "name": "B & O Railroad",
            "owner_key": 0,
            "color": "Black",
            "row": 0,
            "column": 5,
            "price": 200,
            "mortgage": 100,
            "mortgaged": False}

        self.properties[26] = {
            "type": "property",
            "name": "Atlantic Avenue",
            "owner_key": 0,
            "color": "Yellow",
            "row": 0,
            "column": 6,
            "price": 260,
            "rent": 22,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [110, 330, 800, 975],
            "hotels": 0,
            "hotel_rent": 1150,
            "mortgage": 130,
            "mortgaged": False}

        self.properties[27] = {
            "type": "property",
            "name": "Ventnor Avenue",
            "owner_key": 0,
            "color": "Yellow",
            "row": 0,
            "column": 7,
            "price": 260,
            "rent": 22,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [110, 330, 800, 975],
            "hotels": 0,
            "hotel_rent": 1150,
            "mortgage": 130,
            "mortgaged": False}

        self.properties[28] = {
            "type": "utility",
            "name": "Water Works",
            "owner_key": 0,
            "color": "DarkSlateGrey",
            "row": 0,
            "column": 8,
            "price": 150,
            "mortgage": 75,
            "mortgaged": False}

        self.properties[29] = {
            "type": "property",
            "name": "Marvin Gardens",
            "owner_key": 0,
            "color": "Yellow",
            "row": 0,
            "column": 9,
            "price": 280,
            "rent": 24,
            "building_cost": 150,
            "houses": 0,
            "house_rents": [120, 360, 850, 1025],
            "hotels": 0,
            "hotel_rent": 1200,
            "mortgage": 140,
            "mortgaged": False}

        self.properties[30] = {
            "type": "go_to_jail",
            "name": "GO TO JAIL",
            "row": 0,
            "column": 10}

        self.properties[31] = {
            "type": "property",
            "name": "Pacific Avenue",
            "owner_key": 0,
            "color": "Green",
            "row": 1,
            "column": 10,
            "price": 300,
            "rent": 26,
            "building_cost": 200,
            "houses": 0,
            "house_rents": [130, 390, 900, 1100],
            "hotels": 0,
            "hotel_rent": 1275,
            "mortgage": 150,
            "mortgaged": False}

        self.properties[32] = {
            "type": "property",
            "name": "North Carolina Avenue",
            "owner_key": 0,
            "color": "Green",
            "row": 2,
            "column": 10,
            "price": 300,
            "rent": 26,
            "building_cost": 200,
            "houses": 0,
            "house_rents": [130, 390, 900, 1100],
            "hotels": 0,
            "hotel_rent": 1275,
            "mortgage": 150,
            "mortgaged": False}

        self.properties[33] = {
            "type": "community_chest",
            "name": "Community Chest",
            "row": 3,
            "column": 10}

        self.properties[34] = {
            "type": "property",
            "name": "Pennsylvania Avenue",
            "held": False,
            "owner_key": 0,
            "color": "Green",
            "row": 4,
            "column": 10,
            "price": 320,
            "rent": 28,
            "building_cost": 200,
            "houses": 0,
            "house_rents": [150, 450, 1000, 1200],
            "hotels": 0,
            "hotel_rent": 1400,
            "mortgage": 160,
            "mortgaged": False}

        self.properties[35] = {
            "type": "railroad",
            "name": "Short Line Railroad",
            "owner_key": 0,
            "color": "Black",
            "price": 200,
            "row": 5,
            "column": 10,
            "mortgage": 100,
            "mortgaged": False}

        self.properties[36] = {
            "type": "chance",
            "name": "Chance",
            "row": 6,
            "column": 10}

        self.properties[37] = {
            "type": "property",
            "name": "Park Place",
            "owner_key": 0,
            "color": "DarkBlue",
            "row": 7,
            "column": 10,
            "price": 350,
            "rent": 35,
            "building_cost": 200,
            "houses": 0,
            "house_rents": [175, 500, 1100, 1300],
            "hotels": 0,
            "hotel_rent": 1500,
            "mortgage": 175,
            "mortgaged": False}

        self.properties[38] = {
            "type": "tax",
            "name": "Luxury Tax",
            "row": 8,
            "column": 10,
            "tax": 100}

        self.properties[39] = {
            "type": "property",
            "name": "Boardwalk",
            "owner_key": 0,
            "color": "DarkBlue",
            "row": 9,
            "column": 10,
            "price": 400,
            "rent": 50,
            "building_cost": 200,
            "houses": 0,
            "house_rents": [200, 600, 1400, 1700],
            "hotels": 0,
            "hotel_rent": 2000,
            "mortgage": 200,
            "mortgaged": False}

