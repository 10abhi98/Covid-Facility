import json
with open('C:/Users/Abhishek/Downloads/delhi_hospitals_cleanup.json') as f:
    data = json.load(f)

for i in data:
    # Changing key structure
    i['Contact'] = []
    address = {}
    coordinates = {}

    # Restructuring tasks
    tasks_info = {}
    tasks = ['Remidisivir', 'New_Patients', 'Waiting_Patients']
    tasks_stat = {
        'Count': 0,
        'Verified_At': 0
    }

    # Beds
    tasks_info['Beds'] = {
        'Count' : i['Beds'],
        'Verified_At' : i['Last_Updated']
    }

    # Oxygen
    tasks_info['Oxygen'] = {
        'Count' : i['Oxygen'],
        'Verified_At' : i['Last_Updated']
    }

    # Remaining three
    for j in tasks:
        tasks_info[j] = tasks_stat

    # Changing address structure
    address['Street'] = i['Street_Address']
    address['City'] = i['City']
    address['State'] = i['State']
    address['Pincode'] = i['Pincode']
    i['Address'] = address
    i['Response_Rate'] = 'none'
    i['Tasks_Info'] = tasks_info

    # Changing the coordinates structure
    coordinates['Lat'] = i['Lat']
    coordinates['Long'] = i['Long']
    i['Coordinates'] = coordinates

    # Creating contact array
    for j in range(6):
        if i['Contact ' + str(j+1)]:
            if str(i['Contact ' + str(j+1)]).startswith('11'):
                i['Contact ' + str(j+1)] = '011-' + \
                    str(i['Contact ' + str(j+1)])[2:]
            elif str(i['Contact ' + str(j+1)]).startswith('011'):
                i['Contact ' + str(j+1)] = '011-' + str(i['Contact ' + str(j+1)])[4:] if str(
                    i['Contact ' + str(j+1)])[3] == '-' else str(i['Contact ' + str(j+1)])[3:]
            i['Contact'].append(str(i['Contact ' + str(j+1)]))

    # Delete unnecessary keys
    remove_keys = [
        'Street_Address', 'City', 'State', 'Pincode', 'Lat', 'Long',
        'Contact 1', 'Contact 2', 'Contact 3', 'Contact 4', 'Contact 5', 'Contact 6']
    for key in remove_keys:
        del i[key]

    # trim_keys = [
    #     'Name', 'Management', 'Type', 'Pincode', 'Lat', 'Long',
    #     'Contact 1', 'Contact 2', 'Contact 3', 'Contact 4', 'Contact 5', 'Contact 6']
    # for key in trim_keys:
    #     i[key] = i[key].trim()

with open('C:/Users/Abhishek/Desktop/delhiHospitals.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
