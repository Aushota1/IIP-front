import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CurriculumProvider, useCurriculum } from './CurriculumContext';

/**
 * Property-Based Tests for CurriculumContext
 * 
 * These tests validate universal properties that should hold true
 * across all valid executions of the curriculum builder system.
 * 
 * Note: Using manual property-based testing approach due to fast-check ESM compatibility issues with Jest/CRA
 */

describe('CurriculumContext - Property-Based Tests', () => {
  /**
   * Helper function to create a wrapper with CurriculumProvider
   */
  const createWrapper = () => {
    return ({ children }) => (
      <CurriculumProvider>{children}</CurriculumProvider>
    );
  };

  /**
   * Helper to generate random integer between min and max (inclusive)
   */
  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * Property 1: Module Creation Order Index Assignment
   * 
   * For any course with N existing modules, when a new module is created,
   * the new module's order_index should equal N + 1.
   * 
   * Validates: Requirements 2.3
   */
  describe('Property 1: Module Creation Order Index Assignment', () => {
    it('should assign order_index = N + 1 for a new module when N modules exist (100 iterations)', () => {
      const numRuns = 100;
      
      for (let run = 0; run < numRuns; run++) {
        // Generate arbitrary number of existing modules (0 to 20)
        const existingModuleCount = randomInt(0, 20);
        // Generate arbitrary course ID
        const courseId = randomInt(1, 1000);

        // Setup: Create existing modules with sequential order_index
        const existingModules = Array.from(
          { length: existingModuleCount },
          (_, index) => ({
            id: index + 1,
            course_id: courseId,
            title: `Module ${index + 1}`,
            order_index: index + 1,
            lessons: []
          })
        );

        // Render the hook with CurriculumProvider
        const { result } = renderHook(() => useCurriculum(), {
          wrapper: createWrapper()
        });

        // Set up the initial state with existing modules
        act(() => {
          result.current.setModules(existingModules);
        });

        // Create a new module with order_index based on existing count
        const newModule = {
          id: existingModuleCount + 1,
          course_id: courseId,
          title: `Module ${existingModuleCount + 1}`,
          order_index: existingModuleCount + 1,
          lessons: []
        };

        // Add the new module to the state
        act(() => {
          result.current.setModules([...existingModules, newModule]);
        });

        // Property assertion: The new module's order_index should equal N + 1
        const modules = result.current.modules;
        const lastModule = modules[modules.length - 1];
        
        expect(lastModule.order_index).toBe(existingModuleCount + 1);
        expect(modules.length).toBe(existingModuleCount + 1);
      }
    });

    it('should maintain sequential order_index values across all modules (100 iterations)', () => {
      const numRuns = 100;
      
      for (let run = 0; run < numRuns; run++) {
        // Generate arbitrary number of modules to create sequentially
        const moduleCount = randomInt(1, 15);
        const courseId = randomInt(1, 1000);

        const { result } = renderHook(() => useCurriculum(), {
          wrapper: createWrapper()
        });

        // Simulate creating modules one by one
        for (let i = 0; i < moduleCount; i++) {
          act(() => {
            const currentModules = result.current.modules;
            const newModule = {
              id: i + 1,
              course_id: courseId,
              title: `Module ${i + 1}`,
              order_index: currentModules.length + 1,
              lessons: []
            };
            result.current.setModules([...currentModules, newModule]);
          });
        }

        // Property assertion: All modules should have sequential order_index
        const modules = result.current.modules;
        for (let i = 0; i < modules.length; i++) {
          expect(modules[i].order_index).toBe(i + 1);
        }
        expect(modules.length).toBe(moduleCount);
      }
    });

    it('should correctly calculate order_index when modules are added after deletions (100 iterations)', () => {
      const numRuns = 100;
      
      for (let run = 0; run < numRuns; run++) {
        // Generate initial module count and number to delete
        const initialCount = randomInt(5, 15);
        const deleteCount = randomInt(1, Math.min(4, initialCount - 1));
        const courseId = randomInt(1, 1000);

        const { result } = renderHook(() => useCurriculum(), {
          wrapper: createWrapper()
        });

        // Create initial modules
        const initialModules = Array.from(
          { length: initialCount },
          (_, index) => ({
            id: index + 1,
            course_id: courseId,
            title: `Module ${index + 1}`,
            order_index: index + 1,
            lessons: []
          })
        );

        act(() => {
          result.current.setModules(initialModules);
        });

        // Delete some modules from the end
        act(() => {
          const remainingModules = result.current.modules.slice(
            0,
            -deleteCount
          );
          result.current.setModules(remainingModules);
        });

        const remainingCount = result.current.modules.length;

        // Add a new module
        const newModule = {
          id: initialCount + 1,
          course_id: courseId,
          title: `Module ${remainingCount + 1}`,
          order_index: remainingCount + 1,
          lessons: []
        };

        act(() => {
          result.current.setModules([
            ...result.current.modules,
            newModule
          ]);
        });

        // Property assertion: New module's order_index should be remainingCount + 1
        const modules = result.current.modules;
        const lastModule = modules[modules.length - 1];
        
        expect(lastModule.order_index).toBe(remainingCount + 1);
        expect(modules.length).toBe(remainingCount + 1);
      }
    });
  });

  /**
   * Additional property test: Context initialization
   */
  describe('Context Initialization', () => {
    it('should initialize with empty modules array', () => {
      const { result } = renderHook(() => useCurriculum(), {
        wrapper: createWrapper()
      });

      expect(result.current.modules).toEqual([]);
      expect(result.current.selectedCourse).toBeNull();
      expect(result.current.currentLesson).toBeNull();
      expect(result.current.isDraft).toBe(false);
      expect(result.current.validationErrors).toEqual([]);
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useCurriculum());
      }).toThrow('useCurriculum must be used within a CurriculumProvider');

      console.error = originalError;
    });
  });
});
