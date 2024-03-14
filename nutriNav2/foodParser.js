const supabaseClient = require('./supabaseClient');

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const supabase = supabaseClient();

const folderPath = 'dining_halls';
const outputFolder = 'parsed_results_json'; // New folder for storing parsed JSON results

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

async function deleteIfColumnNotNull(tableName, columnName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .delete()
            .not(columnName, 'is', null);

        if (error) {
            throw error;
        }
        console.log(`Rows where "${columnName}" is not null deleted successfully:`, data);
    } catch(error) {
        console.error('Error deleting rows:', error.message);
    }
}

async function pushToSupabase(foodItem, diningHall){
    let information = JSON.stringify(foodItem, null, 2);
    let name = foodItem.food_name
    //console.log(name)
    //console.log(information);
    if(diningHall === 'Bursley'){
        try {
            const { data, error } = await supabase.from(diningHall).upsert({name, information});
            if (error) {
                console.error("Error", error.message);
            } else {
                console.log("Success", data);
            }
        } catch (error) {
            console.error("Caught Error", error.message);
        }
    }
}

function clearOutputFolder(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading the directory ${directory}:`, err);
            return;
        }

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                } else {
                    console.log(`Deleted ${file}`);
                }
            });
        }
    });
}

async function parseHTMLFilesInFolder(folderPath) {
    await deleteIfColumnNotNull('Bursley', 'name');
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                const $ = cheerio.load(data);
                const diningHallName = $('a.level_2.active').text().trim();
                const diningHallFilePath = path.join(__dirname, outputFolder, `${diningHallName}.json`); // Save as JSON

                let diningHallFoods = []; // Array to hold food objects

                // Extract meal times and associate foods with them
                $('h3 > a').each((index, element) => {
                    const mealTime = $(element).text().trim().toLowerCase();
                    $(element).parent().next().find('li').each((foodIndex, foodElement) => {
                        $(foodElement).data('meal-time', mealTime); // Associate food with meal time
                    });
                });

                $('ul.items > li').each((index, element) => {
                    let foodItem = { meal_time: $(element).data('meal-time') }; // Initialize with meal_time
                    foodItem.food_name = $(element).find('.item-name').text().trim();

                    foodItem.allergens = $(element).find('.allergens ul li').map((idx, allergen) => $(allergen).text().trim()).get();
                    foodItem.traits = $(element).find('.traits li').map((idx, trait) => $(trait).text().trim()).get();

                    let nutritionFacts = {};
                    $(element).find('.nutrition-facts tbody tr').each((idx, tr) => {
                        let label = $(tr).find('td').first().text().trim().replace(':', '').replace(/(\r\n|\n|\r)/gm, "").trim();
                        let value = $(tr).find('td').last().text().trim().replace(/(\r\n|\n|\r)/gm, "").trim();

                        const subLabel = label.substring(0, label.indexOf(" "));
                        if (subLabel === 'Serving') {
                            const startIndex = label.indexOf('Size') + 'Size'.length;
                            const subString = label.substring(startIndex).trim();
                            nutritionFacts['Serving Size'] = subString;
                        } else if (subLabel === 'Calories') {
                            const startIndex = label.indexOf('Calories') + 'Calories'.length;
                            const subString = label.substring(startIndex).trim();
                            nutritionFacts['Calories'] = subString;
                        } else if (label && value && label != 'Amount Per Serving') {
                            nutritionFacts[label] = value;
                        }
                    });

                    foodItem.nutrition_facts = nutritionFacts;
                    diningHallFoods.push(foodItem);

                });

                // Save the JSON file
                fs.writeFileSync(diningHallFilePath, JSON.stringify(diningHallFoods, null, 2), 'utf8');
            });
        });
    });
}

clearOutputFolder(outputFolder);

parseHTMLFilesInFolder(folderPath);