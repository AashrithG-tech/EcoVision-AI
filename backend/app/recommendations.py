
RECOMMENDATIONS = {
    "cardboard": {
        "type": "Dry recyclable waste",
        "recyclable": True,
        "color": "#D4A373",
        "instructions": [
            "Remove plastic tape and packaging materials.",
            "Flatten cardboard boxes to save space.",
            "Keep cardboard clean and dry.",
            "Place in the appropriate dry recycling collection."
        ],
        "tip": "Wet or heavily contaminated cardboard may not be recyclable."
    },

    "glass": {
        "type": "Dry recyclable waste",
        "recyclable": True,
        "color": "#38BFA7",
        "instructions": [
            "Empty the glass container.",
            "Rinse it if necessary.",
            "Separate removable lids when required.",
            "Use an appropriate glass recycling collection."
        ],
        "tip": "Broken glass should be handled carefully. Local rules vary."
    },

    "metal": {
        "type": "Dry recyclable waste",
        "recyclable": True,
        "color": "#94A3B8",
        "instructions": [
            "Empty the metal container.",
            "Rinse away food or drink residue.",
            "Separate removable non-metal components.",
            "Place in the appropriate metal recycling collection."
        ],
        "tip": "Aerosol cans and hazardous containers require special handling."
    },

    "paper": {
        "type": "Dry recyclable waste",
        "recyclable": True,
        "color": "#60A5FA",
        "instructions": [
            "Keep paper clean and dry.",
            "Remove plastic wrapping.",
            "Separate heavily contaminated paper.",
            "Place in the paper recycling collection."
        ],
        "tip": "Greasy or laminated paper may not be accepted."
    },

    "plastic": {
        "type": "Dry recyclable waste",
        "recyclable": True,
        "color": "#A78BFA",
        "instructions": [
            "Identify the plastic type where possible.",
            "Empty and rinse the container.",
            "Separate caps if required locally.",
            "Use an appropriate plastic recycling collection."
        ],
        "tip": "Not all plastics are recyclable. Check local acceptance rules."
    },

    "trash": {
        "type": "General waste",
        "recyclable": False,
        "color": "#F87171",
        "instructions": [
            "Check whether any components can be separated.",
            "Avoid mixing hazardous waste with general waste.",
            "Use the designated general waste collection.",
            "Follow local disposal guidelines."
        ],
        "tip": "This category is broad. Batteries and e-waste need separate handling."
    }
}


def get_recommendation(category: str):
    return RECOMMENDATIONS.get(category, {
        "type": "Unknown waste",
        "recyclable": False,
        "color": "#94A3B8",
        "instructions": [
            "Manually identify the material.",
            "Check local waste disposal guidelines."
        ],
        "tip": "Unable to determine a reliable disposal method."
    })

def get_all_recommendations():
    return RECOMMENDATIONS
