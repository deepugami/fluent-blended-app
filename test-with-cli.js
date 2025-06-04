const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function testContract() {
    console.log('🔍 Testing New Rust Contract via gblend CLI');
    
    try {
        // Test the sqrt function directly using gblend call
        console.log('Testing sqrt(4) function...');
        
        // First, let's encode the function call for sqrt(4)
        // Function signature: sqrt(uint256) -> selector: 0x677342ce
        // Parameter: 4 * 10^18 = 0x3635c9adc5dea00000
        const callData = '0x677342ce0000000000000000000000000000000000000000000000003635c9adc5dea00000';
        
        const command = `gblend call --to 0x5e44930a479f34fbc1c9657c68f5b7f761363769 --data "${callData}" --rpc-url https://rpc.dev.gblend.xyz/`;
        
        console.log('Executing call...');
        const { stdout, stderr } = await execAsync(command);
        
        if (stderr) {
            console.error('Error output:', stderr);
        }
        
        if (stdout.includes('missing revert data') || stdout.includes('error')) {
            console.log('❌ Still getting missing revert data error');
            console.log('Output:', stdout);
        } else {
            console.log('✅ SUCCESS! Contract call succeeded!');
            console.log('Result:', stdout);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stdout) {
            console.log('stdout:', error.stdout);
        }
        if (error.stderr) {
            console.log('stderr:', error.stderr);
        }
    }
}

testContract();
