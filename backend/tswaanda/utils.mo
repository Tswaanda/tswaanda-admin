import ExperimentalCycles "mo:base/ExperimentalCycles";
import Float "mo:base/Float";
import Prim "mo:⛔";

module {

    /****************************
    * MEMORY AND CYCLES
    ****************************/
    public func get_memory_in_mb() : Int {
        let rts_memory_size : Nat = Prim.rts_memory_size();
        let mem_size : Float = Float.fromInt(rts_memory_size);
        let memory_in_megabytes = Float.toInt(Float.abs(mem_size / 1_048_576));

        return memory_in_megabytes;
    };

    public func get_heap_in_mb() : Int {
        let rts_heap_size : Nat = Prim.rts_heap_size();
        let heap_size : Float = Float.fromInt(rts_heap_size);
        let heap_in_megabytes = Float.toInt(Float.abs(heap_size / 1_048_576));

        return heap_in_megabytes;
    };

    public func get_cycles_balance() : Int {
        return ExperimentalCycles.balance();
    };

};
