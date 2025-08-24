"""
Test script to demonstrate the shared resources optimization.
This shows that instances are only created once and reused.
"""

from clients.shared import get_agent, get_firestore_client, clear_resource_cache

def test_singleton_behavior():
    print("=== Testing Singleton Behavior ===")
    
    # Clear any existing cache first
    clear_resource_cache()
    print("Cache cleared.\n")
    
    print("1. First call to get_agent() - should create instance:")
    vertex1 = get_agent()
    
    print("\n2. Second call to get_agent() - should reuse instance:")
    vertex2 = get_agent()
    
    print(f"\nSame instance? {vertex1 is vertex2}")
    
    print("\n3. First call to get_agent('gemini-2.0-flash-lite-001') - should create lite instance:")
    vertex_lite1 = get_agent('gemini-2.0-flash-lite-001')
    
    print("\n4. Second call to get_agent('gemini-2.0-flash-lite-001') - should reuse lite instance:")
    vertex_lite2 = get_agent('gemini-2.0-flash-lite-001')
    
    print(f"\nSame lite instance? {vertex_lite1 is vertex_lite2}")
    print(f"Default and lite are different? {vertex1 is not vertex_lite1}")
    
    print("\n5. First call to get_firestore_client() - should create instance:")
    fs1 = get_firestore_client()
    
    print("\n6. Second call to get_firestore_client() - should reuse instance:")
    fs2 = get_firestore_client()
    
    print(f"\nSame firestore instance? {fs1 is fs2}")
    
    print("\n=== Test completed! ===")
    print("All instances are now cached and will be reused across your application.")

if __name__ == "__main__":
    test_singleton_behavior()
