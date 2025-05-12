// Wait a bit before trying to initialize the replica set
print("Waiting before initializing replica set...");
sleep(1000);

try {
  // Check if the replica set is already initialized
  var status = rs.status();
  if(status.ok) {
    print("Replica set is already initialized.");
  }
} catch (err) {
  // If we get an error, the replica set isn't initialized yet
  print("Initializing replica set...");
  
  // Initialize the replica set
  var config = {
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017", priority: 1 }]
  };
  
  rs.initiate(config);
  
  // Wait for the replica set to initialize
  print("Waiting for replica set to initialize...");
  
  // Loop until the replica set is properly initialized
  var maxAttempts = 30;
  var attempts = 0;
  while(attempts < maxAttempts) {
    try {
      status = rs.status();
      if(status.ok && status.members && status.members[0].state === 1) {
        print("Replica set initialized successfully!");
        break;
      }
    } catch(err) {
      print("Still waiting for replica set: " + err);
    }
    sleep(1000);
    attempts++;
  }
  
  if(attempts >= maxAttempts) {
    print("WARNING: Replica set may not be fully initialized after " + maxAttempts + " seconds.");
  }
}

print("Mongo initialization script completed.");
