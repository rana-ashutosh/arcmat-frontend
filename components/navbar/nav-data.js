export const navItems = [
    {
        name: "New",
        image: "/mega-Images/new.jpg",
        isSpecial: true,
        hasDropdown: true,
        categories: [
            {
                name: "Latest Arrivals",
                hasSubmenu: true,
                links: [
                    ["New Furniture", "New Lighting", "New Decor", "New Appliances"],
                    ["Trending Now", "Editor's Picks", "Seasonal Collections", "Limited Editions"]
                ]
            }
        ]
    },
    {
        name: "Construction",
        image: "/mega-Images/construction.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Building Materials",
                hasSubmenu: true,
                links: [
                    ["Bricks & Blocks", "Cement & Concrete", "Timber & Plywood", "Steel & Iron"],
                    ["Stone & Aggregates", "Roofing Materials", "Insulation", "Plaster & Boards"]
                ]
            },
            {
                name: "Chemicals & Adhesives",
                hasSubmenu: true,
                links: [
                    ["Waterproofing", "Tile Adhesives", "Epoxy & Grouts", "Sealants"],
                    ["Concrete Admixtures", "Wall Putty", "Primers", "Cleaners"]
                ]
            }
        ]
    },
    {
        name: "Finishes",
        image: "/mega-Images/Finishes.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Wall Finishes",
                hasSubmenu: true,
                links: [
                    ["Interior Paints", "Exterior Paints", "Wallpapers", "Wall Panels"],
                    ["Texture Paints", "Cladding", "Veneers", "Laminates"]
                ]
            }
        ]
    },
    {
        name: "Door & Windows",
        image: "/mega-Images/Door.png",
        hasDropdown: true,
        categories: [
            {
                name: "Doors",
                hasSubmenu: true,
                links: [
                    ["Main Doors", "Internal Doors", "Sliding Doors", "Glass Doors"],
                    ["Fire Rated Doors", "Door Frames", "Smart Locks", "Door Handles"]
                ]
            },
            {
                name: "Windows",
                hasSubmenu: true,
                links: [
                    ["Sliding Windows", "Casement Windows", "uPVC Windows", "Aluminum Windows"],
                    ["Wooden Windows", "Skylights", "Ventilators", "Window Hardware"]
                ]
            }
        ]
    },
    {
        name: "Lighting",
        image: "/mega-Images/Lighting.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Indoor Lighting",
                hasSubmenu: true,
                links: [
                    ["Ceiling Lights", "Chandeliers", "Pendant Lights", "Wall Lights"],
                    ["Floor Lamps", "Table Lamps", "Recessed Lighting", "Track Lighting"]
                ]
            },
            {
                name: "Outdoor & Technical",
                hasSubmenu: true,
                links: [
                    ["Garden Lights", "Street Lights", "Flood Lights", "Solar Lights"],
                    ["Strip Lights", "Profile Lighting", "Smart Bulbs", "Sensors"]
                ]
            }
        ]
    },
    {
        name: "Furniture",
        image: "/mega-Images/Furniture.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Sofas and armchairs",
                hasSubmenu: true,
                links: [
                    ["Sofas", "Armchairs", "Recliners", "Loveseats", "Sectionals", "Chaise lounges", "Ottomans", "Sofa beds"],
                    ["Futons", "Accent chairs", "Club chairs", "Wingback chairs", "Slipper chairs", "Bean bags", "Poufs", "Benches"],
                ]
            },
            {
                name: "Tables and chairs",
                hasSubmenu: true,
                links: [
                    ["Dining tables", "Coffee tables", "Side tables", "Console tables", "Dining chairs", "Bar stools", "Office chairs", "Desk chairs"],
                    ["End tables", "Nesting tables", "Accent tables", "Folding tables", "Counter stools", "Kitchen chairs", "Patio chairs", "Gaming chairs"],
                ]
            },
            {
                name: "Storage systems and units",
                hasSubmenu: true,
                links: [
                    ["Bookcases", "Shelving units", "Cabinets", "Wardrobes", "Dressers", "Chest of drawers", "TV stands", "Media consoles"],
                    ["Storage bins", "Closet systems", "Shoe racks", "Coat racks", "Hall trees", "Storage benches", "Cubbies", "Wall units"],
                ]
            },
            {
                name: "Sleeping area and children's bedrooms",
                hasSubmenu: true,
                links: [
                    ["Beds", "Mattresses", "Bed frames", "Headboards", "Nightstands", "Bunk beds", "Cribs", "Toddler beds"],
                    ["Daybeds", "Murphy beds", "Platform beds", "Canopy beds", "Loft beds", "Trundle beds", "Bassinets", "Changing tables"],
                ]
            },
            {
                name: "Kids furniture",
                hasSubmenu: true,
                links: [
                    ["Kids beds", "Kids desks", "Kids chairs", "Toy storage", "Kids bookcases", "Play tables", "Kids dressers", "Step stools"],
                    ["Kids nightstands", "Kids benches", "Activity tables", "Art desks", "Reading nooks", "Kids wardrobes", "Toy chests", "Kids shelves"],
                ]
            },
            {
                name: "Furniture components and hardware",
                hasSubmenu: true,
                links: [
                    ["Drawers", "Cabinet doors", "Table tops", "Table bases", "Table legs", "Trestles", "Furniture foils", "Furniture handles"],
                    ["Furniture knobs", "Drawers dividers", "Furniture lighting", "Cable gland systems", "Worktop edging strips", "Plinths", "Furniture feet", "Furniture handles"],
                ]
            },
        ],
    },
    {
        name: "Appliances",
        image: "/mega-Images/Appliances.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Kitchen Appliances",
                hasSubmenu: true,
                links: [
                    ["Refrigerators", "Ovens", "Microwaves", "Dishwashers"],
                    ["Hobs & Chimneys", "Mixer Grinders", "Toasters", "Electric Kettles"]
                ]
            },
            {
                name: "Home Appliances",
                hasSubmenu: true,
                links: [
                    ["Washing Machines", "Dryers", "Air Conditioners", "Air Purifiers"],
                    ["Vacuum Cleaners", "Water Heaters", "Fans", "Irons"]
                ]
            }
        ]
    },
    {
        name: "Decor",
        image: "/mega-Images/Decor.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Home Textiles",
                hasSubmenu: true,
                links: [
                    ["Curtains & Drapes", "Cushions & Covers", "Rugs & Carpets", "Bedding Sets"],
                    ["Table Linen", "Towels", "Throws", "Doormats"]
                ]
            },
            {
                name: "Accessories",
                hasSubmenu: true,
                links: [
                    ["Vases", "Mirrors", "Wall Art", "Clocks"],
                    ["Candles", "Plant Pots", "Sculptures", "Photo Frames"]
                ]
            }
        ]
    },
    {
        name: "Bathware",
        image: "/mega-Images/Bathware.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Sanitaryware",
                hasSubmenu: true,
                links: [
                    ["Toilets", "Wash Basins", "Bathtubs", "Urinals"],
                    ["Shower Trays", "Bidets", "Cisterns", "Seat Covers"]
                ]
            },
            {
                name: "Faucets & Showers",
                hasSubmenu: true,
                links: [
                    ["Basin Mixers", "Shower Heads", "Hand Showers", "Bath Spouts"],
                    ["Diverters", "Health Faucets", "Kitchen Sinks", "Tap Accessories"]
                ]
            }
        ]
    },
    {
        name: "Sustainable",
        image: "/mega-Images/Sustainable.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Eco-Friendly Materials",
                hasSubmenu: true,
                links: [
                    ["Bamboo Products", "Cork Flooring", "Reclaimed Wood", "Recycled Metal"],
                    ["Natural Paints", "Eco Bricks", "Solar Glass", "Green Insulation"]
                ]
            },
            {
                name: "Energy Saving",
                hasSubmenu: true,
                links: [
                    ["Solar Panels", "Rainwater Harvesting", "Energy Meters", "Composters"],
                    ["LED Systems", "Water Saving Nozzles", "Smart Thermostats", "Inverters"]
                ]
            }
        ]
    },
    {
        name: "Smart",
        image: "/mega-Images/Smart.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Home Automation",
                hasSubmenu: true,
                links: [
                    ["Smart Speakers", "Smart Plugs", "Smart Switches", "Sensors"],
                    ["Security Cameras", "Video Doorbells", "Smart Locks", "Hubs"]
                ]
            }
        ]
    },
    {
        name: "Protection",
        image: "/mega-Images/Protection.jpg",
        hasDropdown: true,
        categories: [
            {
                name: "Waterproofing Systems",
                hasSubmenu: true,
                links: [
                    [
                        "Liquid Membranes",
                        "Elastomeric Coatings",
                        "Cementitious Coatings",
                        "Bituminous Membranes"
                    ],
                    [
                        "Basement Waterproofing",
                        "Terrace Waterproofing",
                        "Wet Area Solutions"
                    ]
                ]
            },
            {
                name: "Thermal Insulation",
                hasSubmenu: true,
                links: [
                    [
                        "XPS Insulation",
                        "Glass Wool",
                        "Reflective Foil",
                        "PU Foam"
                    ],
                    [
                        "Roof Insulation",
                        "Wall Insulation",
                        "Floor Insulation Panels"
                    ]
                ]
            },
            {
                name: "Soundproofing & Acoustics",
                hasSubmenu: true,
                links: [
                    [
                        "Acoustic Foam Panels",
                        "Gypsum Boards",
                        "Acoustic Backing"
                    ],
                    [
                        "Vibration Isolators",
                        "Underlayment Systems"
                    ]
                ]
            },
            {
                name: "Pest & Termite Control",
                hasSubmenu: true,
                links: [
                    [
                        "Anti-Termite Liquids",
                        "Soil Treatment Chemicals"
                    ],
                    [
                        "Anti-Termite Plywood",
                        "Preventive Treatments"
                    ]
                ]
            },
            {
                name: "Structural Protection",
                hasSubmenu: true,
                links: [
                    [
                        "Shock Absorbers",
                        "Base Isolators"
                    ],
                    [
                        "Anti-Crack Compounds",
                        "Seismic Protection Materials"
                    ]
                ]
            },
            {
                name: "Healthy Wall Finishes",
                hasSubmenu: true,
                links: [
                    [
                        "Lime Plasters",
                        "Clay-Based Finishes"
                    ],
                    [
                        "Low-VOC Coatings",
                        "Breathable Wall Systems"
                    ]
                ]
            },
            {
                name: "Protective Coatings",
                hasSubmenu: true,
                links: [
                    [
                        "Anti-Carbonation Coatings",
                        "RCC Protection"
                    ],
                    [
                        "UV-Resistant Coatings",
                        "Anti-Corrosion Coatings"
                    ]
                ]
            }
        ]
    }

];