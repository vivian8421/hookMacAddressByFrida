var GetAdaptersInfo = Module.getExportByName(null, "GetAdaptersInfo");

Interceptor.attach(GetAdaptersInfo, {
    onEnter: function (args) {
        this.pAdapterInfo = args[0];
    },
    onLeave: function (retVal) {
        var adapter = this.pAdapterInfo;
        var adapterCount = 0; 

        while (adapter.readPointer() != 0x0) {
            var adapterNamePtr = adapter.add(8); 
            var adapterName = adapterNamePtr.readUtf8String();
            console.log("Adapter Name:", adapterName);
            if (adapterName.includes("{15F7DD03-2430-45D8-8847-078013952B46}")) {
                console.log("Found the adapter! Modifying MAC address...");
                var macAddressPtr = adapter.add(404); 
                console.log("Original MAC Address:", macAddressPtr.readByteArray(6));
                var newMacAddress = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                Memory.writeByteArray(macAddressPtr, newMacAddress);

                console.log("Modified MAC Address:", macAddressPtr.readByteArray(6));
            }

            adapter = adapter.readPointer(); 
            adapterCount++;
        }

        console.log("Total Adapters Processed:", adapterCount);
    }
});
