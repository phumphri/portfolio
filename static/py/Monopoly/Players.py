class Players:

    def __init__(self):

        # Create a dictionary of players.
        self.players = {}

        # Populate the players dictionary.
        self.players[1] = {
            "name": "Car",
            "bot": False,
            "assigned": False,
            "sequence": 0,
            "balance": 6000,
            "bankrupt": False,
            "image": None,
            "jail": False,                  # True indicates if the player is in jail.
            "cards": 0,                     # The umber of get-out-of-jail cards owned by the player.
            "doubles": 0,                   # The number of doubles rolled by this player.
            "rolls_in_jail": 0,             # The number of times the player has rolled dice while in jail.
            "property_keys": [],
            "queue":[]
        }

        self.players[2] = {
            "name": "Top Hat",
            "bot": False,
            "assigned": False,
            "id": "top_hat",
            "sequence": 0,
            "balance": 1500,
            "bankrupt": False,
            "image": None,
            "jail": False,                  # True indicates if the player is in jail.
            "cards": 0,                     # The umber of get-out-of-jail cards owned by the player.
            "doubles": 0,                   # The number of doubles rolled by this player.
            "rolls_in_jail": 0,             # The number of times the player has rolled dice while in jail.
            "property_keys": [],
            "queue": []
        }

        self.players[3] = {
            "name": "Shoe",
            "bot": False,
            "assigned": False,
            "sequence": 0,
            "balance": 1500,
            "bankrupt": False,
            "image": None,
            "jail": False,                  # True indicates if the player is in jail.
            "cards": 0,                     # The umber of get-out-of-jail cards owned by the player.
            "doubles": 0,                   # The number of doubles rolled by this player.
            "rolls_in_jail": 0,             # The number of times the player has rolled dice while in jail.
            "property_keys": [],
            "queue": []
        }

        self.players[4] = {
            "name": "Dog",
            "bot": False,
            "assigned": False,
            "sequence": 0,
            "balance": 1500,
            "bankrupt": False,
            "image": None,
            "jail": False,                  # True indicates if the player is in jail.
            "cards": 0,                     # The umber of get-out-of-jail cards owned by the player.
            "doubles": 0,                   # The number of doubles rolled by this player.
            "rolls_in_jail": 0,             # The number of times the player has rolled dice while in jail.
            "property_keys": [],
            "queue": []
        }
